import ProjectListItem from "./ProjectListItem";

const ProjectListsList = ({ projectLists, onSelectProjectList }) => {
  return (
    <ul className="py-1 space-y-1">
      {projectLists.map((projectList) => (
        <ProjectListItem
          key={projectList.id}
          projectList={projectList}
          onSelectProjectList={onSelectProjectList}
        />
      ))}
    </ul>
  );
};

export default ProjectListsList;
