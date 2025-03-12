const path = require('path');
const fse = require('fs-extra');
const prompt = require('prompt');
const copydir = require('copy-dir');

const filesToSubstitute = [
    "src/App.jsx",
    "src/index.jsx",
    "package.json",
    "pankosmia_metadata.json",
    "README.md",
    "vite.config.js"
];

const schema = {
    properties: {
        parentDir: {
            required: true
        },
        projectId: {
            pattern: /^[a-zA-Z][a-zA-Z0-9\-]+[a-zA-Z0-9]$/,
            message: "Project ID must start with a letter and contain only numbers, letters (A-z) and dashes",
            required: true
        },
        projectTitle: {
            required: true
        },
        projectSummary: {
            required: true
        },
        requireNet: {
            pattern: /^(true)|(false)$/,
            message: "Require Net must be 'true' or 'false'",
            required: true
        },
        requireDebug: {
            pattern: /^(true)|(false)$/,
            message: "Require Debug must be 'true' or 'false'",
            required: true
        }
    }
};

prompt.start();

prompt.get(
    schema,
    function (err, result) {
        const parentDir = path.resolve(result.parentDir);
        if (!fse.pathExistsSync(parentDir)) {
            throw new Error(`Parent dir '{parentDir}' does not exist`);
        }
        const targetDir = path.join(parentDir, result.projectId);
        if (fse.pathExistsSync(targetDir)) {
            throw new Error(`Target dir '${targetDir}' already exists`);
        }
        console.log(`** Copying Files to ${targetDir}`);
        copydir.sync(path.resolve('../templates'), targetDir);
        console.log("** Customizing files:");
        for (const fileToSubstitute of filesToSubstitute) {
            console.log(`   - ${fileToSubstitute}`);
            const substFilePath = path.join(targetDir, fileToSubstitute);
            let substFile = fse.readFileSync(substFilePath).toString();
            substFile = substFile
                .replace(/%%PROJECTID%%/g, result.projectId)
                .replace(/%%PROJECTTITLE%%/g, result.projectTitle)
                .replace(/%%PROJECTSUMMARY%%/g, result.projectSummary)
                .replace(/%%REQUIRENET%%/g, result.requireNet)
                .replace(/%%REQUIREDEBUG%%/g, result.requireDebug);
            fse.writeFileSync(substFilePath, substFile);
        }
        console.log("Done! Now:");
        console.log(`   - cd ${targetDir}`);
        console.log(`   - npm install`);
        console.log(`   - npm run build`);
        console.log("   - Add it to user or app config:");
        console.log(`
        
{
     "path": "${targetDir}"
}
        
        `);
        console.log("   - Restart Pankosmia server");
    }
);
