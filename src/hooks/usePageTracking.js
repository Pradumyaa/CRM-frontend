import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';

const usePageTracking = () => {
    const location = useLocation();

    useEffect(() => {
        if (window.gtag) {
            window.gtag('config', 'G-GBCNZYW0K5', {
                page_path: location.pathname + location.search,
            });
        }
    }, [location]);
}

export default usePageTracking;