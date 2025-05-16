const http = require("http");
const url = require("url");
const fs = require("fs").promises;
const path = require("path");
const querystring = require("querystring");
const pug = require("pug");
require("dotenv").config();

// Configuration du serveur
const PORT = process.env.APP_PORT || 3000;
const HOST = process.env.APP_HOST || "localhost";

// Import des utilitaires de gestion des étudiants
const {
	readStudents,
	addStudent,
	deleteStudent,
	updateStudent,
} = require("./utils/studentUtils");

// Configuration du serveur HTTP
const server = http.createServer(async (req, res) => {
	const { method, url: reqUrl } = req;
	const parsedUrl = url.parse(reqUrl, true);
	const pathname = parsedUrl.pathname;

	// Gestion des fichiers statiques (CSS, JS, etc.)
	if (pathname.startsWith("/assets/")) {
		try {
			const filePath = path.join(__dirname, pathname);
			const extname = path.extname(filePath);
			let contentType = "text/html";

			switch (extname) {
				case ".css":
					contentType = "text/css";
					break;
				case ".js":
					contentType = "text/javascript";
					break;
			}

			const content = await fs.readFile(filePath, "utf8");
			res.writeHead(200, { "Content-Type": contentType });
			res.end(content, "utf8");
		} catch (error) {
			res.writeHead(404);
			res.end("File not found");
		}
		return;
	}

	// Traitement des données POST
	if (method === "POST") {
		let body = "";
		req.on("data", (chunk) => {
			body += chunk.toString();
		});

		req.on("end", async () => {
			const postData = querystring.parse(body);

			// Gestion des différentes routes POST
			if (pathname === "/add-student") {
				await handleAddStudent(req, res, postData);
			} else if (pathname.startsWith("/delete/")) {
				const index = parseInt(pathname.split("/")[2]);
				await handleDeleteStudent(req, res, index);
			} else if (pathname.startsWith("/update/")) {
				const index = parseInt(pathname.split("/")[2]);
				await handleUpdateStudent(req, res, index, postData);
			} else {
				res.writeHead(404);
				res.end("Not Found");
			}
		});
		return;
	}

	// Gestion des requêtes GET
	try {
		if (pathname === "/" || pathname === "/home") {
			renderHomePage(req, res);
		} else if (pathname === "/users") {
			await renderUsersPage(req, res);
		} else if (pathname.startsWith("/edit/")) {
			const index = parseInt(pathname.split("/")[2]);
			await renderEditPage(req, res, index);
		} else {
			res.writeHead(404);
			res.end("Page not found");
		}
	} catch (error) {
		console.error("Erreur lors du traitement de la requête :", error);
		res.writeHead(500);
		res.end("Erreur interne du serveur");
	}
});

// Gestionnaires de routes
function renderHomePage(req, res, message = "", messageType = "") {
	try {
		const html = pug.renderFile(path.join(__dirname, "views", "home.pug"), {
			path: "/",
			message,
			messageType,
		});

		res.writeHead(200, { "Content-Type": "text/html" });
		res.end(html);
	} catch (error) {
		console.error("Erreur lors du rendu de la page d'accueil :", error);
		res.writeHead(500);
		res.end("Erreur lors du chargement de la page d'accueil");
	}
}

async function renderUsersPage(req, res, message = "", messageType = "") {
	try {
		const students = await readStudents();
		const html = pug.renderFile(
			path.join(__dirname, "views", "users.pug"),
			{
				path: "/users",
				students,
				message,
				messageType,
			},
		);

		res.writeHead(200, { "Content-Type": "text/html" });
		res.end(html);
	} catch (error) {
		console.error(
			"Erreur lors du rendu de la page des utilisateurs :",
			error,
		);
		res.writeHead(500);
		res.end("Erreur lors du chargement de la page des utilisateurs");
	}
}

async function renderEditPage(req, res, index, message = "", messageType = "") {
	try {
		const students = await readStudents();
		if (index < 0 || index >= students.length) {
			res.writeHead(302, { "Location": "/users" });
			res.end();
			return;
		}

		const html = pug.renderFile(path.join(__dirname, "views", "edit.pug"), {
			path: "/users",
			student: students[index],
			studentIndex: index,
			message,
			messageType,
		});

		res.writeHead(200, { "Content-Type": "text/html" });
		res.end(html);
	} catch (error) {
		console.error("Erreur lors du rendu de la page d'édition :", error);
		res.writeHead(500);
		res.end("Erreur lors du chargement de la page d'édition");
	}
}

async function handleAddStudent(req, res, postData) {
	try {
		const { name, birth } = postData;

		if (!name || !birth) {
			renderHomePage(req, res, "Tous les champs sont requis", "error");
			return;
		}

		await addStudent({ name, birth });

		res.writeHead(302, { "Location": "/users" });
		res.end();
	} catch (error) {
		console.error("Erreur lors de l'ajout de l'étudiant :", error);
		renderHomePage(
			req,
			res,
			"Erreur lors de l'ajout de l'étudiant",
			"error",
		);
	}
}

async function handleDeleteStudent(req, res, index) {
	try {
		await deleteStudent(index);

		res.writeHead(302, { "Location": "/users" });
		res.end();
	} catch (error) {
		console.error("Erreur lors de la suppression de l'étudiant :", error);
		res.writeHead(500);
		res.end("Erreur lors de la suppression de l'étudiant");
	}
}

async function handleUpdateStudent(req, res, index, postData) {
	try {
		const { name, birth } = postData;

		if (!name || !birth) {
			await renderEditPage(
				req,
				res,
				index,
				"Tous les champs sont requis",
				"error",
			);
			return;
		}

		const success = await updateStudent(index, { name, birth });
		if (success) {
			res.writeHead(302, { "Location": "/users" });
			res.end();
		} else {
			res.writeHead(302, { "Location": "/users" });
			res.end();
		}
	} catch (error) {
		console.error("Erreur lors de la mise à jour de l'étudiant :", error);
		await renderEditPage(
			req,
			res,
			index,
			"Erreur lors de la mise à jour de l'étudiant",
			"error",
		);
	}
}

// Démarrage du serveur
server.listen(PORT, HOST, () => {
	console.log(`Serveur démarré à l'adresse : http://${HOST}:${PORT}/`);
});
