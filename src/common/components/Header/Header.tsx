import { FaGithub } from "react-icons/fa";

import "./Header.scss";

const month = new Date().getUTCMonth() + 1;
const year = new Date().getFullYear();
const semester = month >= 7 ? 1 : 2;

const Header: React.FC = () => {
  return (
    <div className="header">
      <div className="header--title">
        <h3>
          UET, học kì {semester}, năm học {semester === 1 ? year : year - 1}-{semester === 1 ? year + 1 : year}
        </h3>
      </div>
      <div className="header--github-repo">
        <a href="https://github.com/duong755/schedule-uet-fe/issues" rel="noreferrer" target="_blank">
          <FaGithub />&nbsp;Góp ý
        </a>
      </div>
    </div>
  );
};

Header.displayName = "Header";
export { Header };
