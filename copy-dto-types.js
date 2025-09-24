const fs = require("fs");
const path = require("path");
const glob = require("glob");

// Find all DTO files
const dtoFiles = glob.sync("apps/server/src/**/dto/*.dto.ts");

const typeDefinitions = new Set(); // Use Set to prevent duplicates

dtoFiles.forEach((file) => {
  const content = fs.readFileSync(file, "utf8");
  
  // Extract class names that are exported
  const classMatches = content.match(/export class (\w+Dto)/g);
  
  if (classMatches) {
    classMatches.forEach((match) => {
      const className = match.replace("export class ", "");
      // Convert class name to type name (e.g., CreateGameDto -> CreateGameDtoType)
      const typeName = className + "Type";
      
      // Add type definition that references the class
      const typeDefinition = `export type ${typeName} = InstanceType<typeof import('${file.replace('apps/server/src/', '../')}').${className}>;`;
      typeDefinitions.add(typeDefinition);
    });
  }
});

// Generate the types section for index.ts
const typesSection = `// DTO Types - Auto-generated from DTO files
${Array.from(typeDefinitions).join('\n')}
`;

// Clear and write to the types file
fs.writeFileSync("apps/server/src/types/dto-types.auto.ts", typesSection);

console.log(`Generated ${typeDefinitions.size} unique DTO type definitions`);
