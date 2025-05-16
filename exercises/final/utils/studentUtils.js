const fs = require("fs").promises;
const path = require("path");

const DATA_FILE = path.join(__dirname, "..", "data", "students.json");

async function readStudents() {
	try {
		const data = await fs.readFile(DATA_FILE, "utf8");
		return JSON.parse(data);
	} catch (error) {
		console.error(
			"Erreur lors de la lecture du fichier des étudiants :",
			error,
		);
		return [];
	}
}

async function writeStudents(students) {
	try {
		await fs.writeFile(
			DATA_FILE,
			JSON.stringify(students, null, 2),
			"utf8",
		);
		return true;
	} catch (error) {
		console.error(
			"Erreur lors de l'écriture du fichier des étudiants :",
			error,
		);
		return false;
	}
}

async function addStudent(student) {
	try {
		const students = await readStudents();
		students.push(student);
		return await writeStudents(students);
	} catch (error) {
		console.error("Erreur lors de l'ajout d'un étudiant :", error);
		return false;
	}
}

async function deleteStudent(index) {
	try {
		const students = await readStudents();
		if (index >= 0 && index < students.length) {
			students.splice(index, 1);
			return await writeStudents(students);
		}
		return false;
	} catch (error) {
		console.error("Erreur lors de la suppression d'un étudiant :", error);
		return false;
	}
}

async function updateStudent(index, studentData) {
	try {
		const students = await readStudents();
		if (index >= 0 && index < students.length) {
			students[index] = { ...students[index], ...studentData };
			return await writeStudents(students);
		}
		return false;
	} catch (error) {
		console.error("Erreur lors de la mise à jour d'un étudiant :", error);
		return false;
	}
}

module.exports = {
	readStudents,
	writeStudents,
	addStudent,
	deleteStudent,
	updateStudent,
};
