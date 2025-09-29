const fs = require("fs");
const path = require("path");
const glob = require("glob");

// Find all service files (excluding cron services and app.service.ts)
const serviceFiles = glob.sync("apps/server/src/**/*.service.ts", {
  ignore: [
    "apps/server/src/**/cron-*/**",
    "apps/server/src/app.service.ts"
  ]
});

const serviceTypes = new Set(); // Use Set to prevent duplicates

serviceFiles.forEach((file) => {
  const content = fs.readFileSync(file, "utf8");
  
  // Extract service class name
  const serviceMatch = content.match(/export class (\w+Service)/);
  if (!serviceMatch) return;
  
  const serviceName = serviceMatch[1];
  
  // Extract all async method names
  const methodMatches = content.match(/async (\w+)\(/g);
  
  if (methodMatches) {
    methodMatches.forEach((match) => {
      const methodName = match.replace("async ", "").replace("(", "");
      
      // Capitalize first letter of method name
      const capitalizedMethodName = methodName.charAt(0).toUpperCase() + methodName.slice(1);
      
      // Create type name: [ServiceName][MethodName]
      const typeName = `${serviceName}${capitalizedMethodName}`;
      
      // Create the type definition - use InstanceType to get the service instance type
      const typeDefinition = `export type ${typeName} = Awaited<ReturnType<InstanceType<typeof import('${file.replace('apps/server/src/', '../')}').${serviceName}>['${methodName}']>>;`;
      serviceTypes.add(typeDefinition);
      
      // Check if method returns an array based on method name patterns
      const isArrayReturnMethod = 
        (methodName.startsWith('find') && methodName.includes('All')) ||
        (methodName.startsWith('get') && methodName.includes('All')) ||
        methodName.includes('getMy') ||
        methodName.includes('findMany');
      
      if (isArrayReturnMethod) {
        const instanceTypeName = `${typeName}Instance`;
        const instanceTypeDefinition = `export type ${instanceTypeName} = ${typeName}[number];`;
        serviceTypes.add(instanceTypeDefinition);
      }
    });
  }
});

// Helper function to extract method content
function extractMethodContent(content, methodName) {
  const methodRegex = new RegExp(`async ${methodName}\\([\\s\\S]*?\\n\\s*\\}`, 'g');
  const match = content.match(methodRegex);
  return match ? match[0] : null;
}

// Generate the types section
const typesSection = `// Service Types - Auto-generated from Service files
${Array.from(serviceTypes).join('\n')}
`;

// Clear and write to the types file
fs.writeFileSync("apps/server/src/types/service-types.auto.ts", typesSection);

console.log(`Generated ${serviceTypes.size} unique service type definitions`);
