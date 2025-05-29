// services/DocumentService.js
import axios from "axios";

/**
 * Service for managing document uploads and retrievals
 * This centralizes all document operations for consistency across admin and employee views
 */
class DocumentService {
  constructor() {
    this.apiBaseUrl =
      import.meta.env.VITE_API_URL || "https://getmax-backend.vercel.app/api";
    this.token = localStorage.getItem("token");
  }

  /**
   * Set authorization token (should be called on login/refresh)
   * @param {string} token - JWT token
   */
  setToken(token) {
    this.token = token;
    localStorage.setItem("token", token);
  }

  /**
   * Get authorization headers
   * @returns {Object} Headers object with Authorization
   */
  getHeaders() {
    return {
      Authorization: `Bearer ${this.token}`,
      "Content-Type": "application/json",
    };
  }

  /**
   * Get multipart headers for file uploads
   * @returns {Object} Headers object with Authorization but no Content-Type
   */
  getMultipartHeaders() {
    return {
      Authorization: `Bearer ${this.token}`,
      // Don't set Content-Type for multipart/form-data - let browser set it with boundary
    };
  }

  /**
   * Upload document to Cloudinary via our backend
   * @param {File} file - File object to upload
   * @param {string} employeeId - ID of the employee
   * @param {string} documentType - Type of document (contract, resume, etc.)
   * @returns {Promise<Object>} Document data including URL
   */
  async uploadDocument(file, employeeId, documentType) {
    try {
      console.log("DocumentService: Starting upload", {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        employeeId,
        documentType,
      });

      // Create form data
      const formData = new FormData();
      formData.append("image", file); // Using 'image' to match multer configuration
      formData.append("employeeId", employeeId);
      formData.append("documentType", documentType);

      // Log FormData contents (for debugging)
      console.log("FormData contents:");
      for (let pair of formData.entries()) {
        console.log(
          pair[0] +
            ": " +
            (pair[1] instanceof File ? `File(${pair[1].name})` : pair[1])
        );
      }

      // Upload to Cloudinary through our backend
      const response = await axios.post(
        `${this.apiBaseUrl}/documents/upload`,
        formData,
        {
          headers: this.getMultipartHeaders(),
          timeout: 30000, // 30 second timeout for large files
        }
      );

      console.log("Upload response:", response.data);

      // Save document metadata to the documents collection if needed
      if (response.data && response.data.imageUrl) {
        const documentData = {
          employeeId,
          documentType,
          name: file.name,
          size: file.size,
          type: file.type,
          url: response.data.imageUrl,
          uploadDate: new Date().toISOString(),
        };

        return documentData;
      } else {
        throw new Error("Upload failed: No URL returned from server");
      }
    } catch (error) {
      console.error("DocumentService: Upload error:", error);

      if (error.response) {
        // Server responded with error status
        console.error("Server response:", error.response.data);
        throw new Error(
          error.response.data.message || "Server error during upload"
        );
      } else if (error.request) {
        // Request made but no response received
        console.error("No response received:", error.request);
        throw new Error(
          "No response from server. Please check your connection."
        );
      } else {
        // Something else happened
        console.error("Upload setup error:", error.message);
        throw new Error(`Upload failed: ${error.message}`);
      }
    }
  }

  /**
   * Save document metadata to the database
   * @param {Object} documentData - Document metadata
   * @returns {Promise<Object>} Saved document data
   */
  async saveDocumentMetadata(documentData) {
    try {
      const response = await axios.post(
        `${this.apiBaseUrl}/documents`,
        documentData,
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error("Error saving document metadata:", error);
      throw error;
    }
  }

  /**
   * Get documents for an employee
   * @param {string} employeeId - ID of the employee
   * @returns {Promise<Array>} List of documents
   */
  async getEmployeeDocuments(employeeId) {
    try {
      console.log(
        `DocumentService: Fetching documents for employee ${employeeId}`
      );

      const response = await axios.get(
        `${this.apiBaseUrl}/documents/${employeeId}`,
        { headers: this.getHeaders() }
      );

      console.log(
        `DocumentService: Found ${response.data.documents.length} documents`
      );
      return response.data.documents;
    } catch (error) {
      console.error("Error getting employee documents:", error);
      if (error.response && error.response.status === 404) {
        // No documents found is not really an error
        return [];
      }
      throw error;
    }
  }

  /**
   * Delete a document
   * @param {string} documentId - ID of the document to delete
   * @returns {Promise<Object>} Result of deletion
   */
  async deleteDocument(documentId) {
    try {
      console.log(`DocumentService: Deleting document ${documentId}`);

      const response = await axios.delete(
        `${this.apiBaseUrl}/documents/${documentId}`,
        { headers: this.getHeaders() }
      );

      console.log("DocumentService: Document deleted successfully");
      return response.data;
    } catch (error) {
      console.error("Error deleting document:", error);
      throw error;
    }
  }

  /**
   * Check if a document exists
   * @param {string} employeeId - ID of the employee
   * @param {string} documentType - Type of document
   * @returns {Promise<boolean>} Whether document exists
   */
  async documentExists(employeeId, documentType) {
    try {
      const documents = await this.getEmployeeDocuments(employeeId);
      return documents.some((doc) => doc.documentType === documentType);
    } catch (error) {
      console.error("Error checking document existence:", error);
      return false;
    }
  }

  /**
   * Legacy compatibility layer - get document from localStorage
   * This helps during transition to database storage
   * @param {string} employeeId - ID of the employee
   * @param {string} documentType - Type of document
   * @returns {Object|null} Document data if exists
   */
  getDocumentFromLocalStorage(employeeId, documentType) {
    try {
      const key = `document_${documentType}_${employeeId}`;
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error("Error getting document from localStorage:", error);
      return null;
    }
  }

  /**
   * Migration utility - move documents from localStorage to backend
   * @param {string} employeeId - ID of the employee
   * @returns {Promise<Object>} Migration results
   */
  async migrateLocalDocumentsToBackend(employeeId) {
    try {
      const documentTypes = [
        "contract",
        "resume",
        "payroll",
        "performance",
        "identification",
        "certifications",
      ];
      const migratedDocs = [];
      const failedDocs = [];

      console.log(
        `DocumentService: Starting migration for employee ${employeeId}`
      );

      for (const docType of documentTypes) {
        const localDoc = this.getDocumentFromLocalStorage(employeeId, docType);

        if (localDoc && localDoc.dataUrl) {
          try {
            console.log(`Migrating ${docType} for employee ${employeeId}`);

            // Convert data URL to blob
            const response = await fetch(localDoc.dataUrl);
            const blob = await response.blob();
            const file = new File([blob], localDoc.name, {
              type: localDoc.type,
            });

            // Upload using the service method
            const uploadedDoc = await this.uploadDocument(
              file,
              employeeId,
              docType
            );
            migratedDocs.push(uploadedDoc);

            // Clear from localStorage after successful migration
            localStorage.removeItem(`document_${docType}_${employeeId}`);
            console.log(
              `Successfully migrated ${docType} for employee ${employeeId}`
            );
          } catch (docError) {
            console.error(
              `Failed to migrate ${docType} for employee ${employeeId}:`,
              docError
            );
            failedDocs.push(docType);
          }
        }
      }

      console.log(`Migration complete for employee ${employeeId}:`, {
        migrated: migratedDocs.length,
        failed: failedDocs.length,
      });

      return {
        success: true,
        migratedCount: migratedDocs.length,
        failedCount: failedDocs.length,
        migratedDocs,
        failedDocs,
      };
    } catch (error) {
      console.error("Error during migration:", error);
      throw error;
    }
  }

  /**
   * Get document statistics
   * @returns {Promise<Object>} Document statistics
   */
  async getDocumentStats() {
    try {
      const response = await axios.get(`${this.apiBaseUrl}/documents/stats`, {
        headers: this.getHeaders(),
      });
      return response.data.stats;
    } catch (error) {
      console.error("Error fetching document stats:", error);
      throw error;
    }
  }
}

// Create singleton instance
const documentService = new DocumentService();
export default documentService;
