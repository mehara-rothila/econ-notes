import React from 'react';
import Container from 'react-bootstrap/Container';
import LectureNotes from './components/LectureNotes';
import TutorialSolutions from './components/TutorialSolutions';
import './App.css';

function App() {
  return (
    <Container fluid="lg">
      <LectureNotes />
      <hr />
      <TutorialSolutions />
    </Container>
  );
}

export default App;