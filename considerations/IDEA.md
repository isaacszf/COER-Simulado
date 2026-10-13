# Idea

The idea here is to create a place for people to train for the **COER (Certificado de Operador de Estação de Radioamador)** exam. One thing I noticed is that there isn't a centralized or easily accessible place to solve questions related to the subjects covered in the exam, and that sucks.

For now, the scope here is limited to the lowest "class" (Class C/Carteira C).

## How do I imagine this working?

### Getting the data

1. Survey on the exam subjects: what are they, where can i get official questions of previous exams and etc
	- More info here (maybe): https://www.gov.br/anatel/pt-br/regulado/outorga/radioamador-e-radio-cidadao/habilitacao-do-radioamador
2. Extraction and cataloging (which subject) of these questions
	- Maybe AI generated questions based on the original ones
3. Storing all the questions in a database (prob SQLITE)

### App usability

- Simple and easy to navigate UI, inspired by "mock exam"-like websites
- Really inclined to make the UI have a more retro/classic look, but still usable
- Static website, no need for SPA CSR
	- Im thinking about using Astro for this, although i never used it
- Prob no backend, just a JSON file to store the questions and answers
