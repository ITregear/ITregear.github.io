import './App.css';
import { FaLinkedin, FaGithub, FaTwitter } from 'react-icons/fa';

function App() {
  return (
    <div className="page-centerer">
      <div className="columns">
        <div className="left-col">
          <h1 className="typewriter">Ivan Tregear</h1>
          <div className="bio">
            Engineer with a passion for technology, design, and minimalism. Always learning, always building.
          </div>
        </div>
        <div className="right-col">
          <div className="links-list">
            <a href="#" target="_blank" rel="noopener noreferrer">How I Built This Portfolio</a>
            <a href="#" target="_blank" rel="noopener noreferrer">Minimalist Productivity Tools</a>
            <a href="#" target="_blank" rel="noopener noreferrer">Blog: Thoughts on Simplicity</a>
          </div>
          <div className="socials-row">
            <a href="https://www.linkedin.com/in/example" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="icon linkedin">
              <FaLinkedin />
            </a>
            <a href="https://github.com/example" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="icon github">
              <FaGithub />
            </a>
            <a href="https://twitter.com/example" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="icon twitter">
              <FaTwitter />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App; 