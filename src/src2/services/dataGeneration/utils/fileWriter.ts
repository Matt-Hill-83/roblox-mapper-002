import { Person } from "../types/person.interface";
import { Country } from "../types/country.interface";

export class FileWriter {
  /**
   * Converts data to a Lua table string format
   */
  private dataToLuaString(data: any): string {
    if (typeIs(data, "string")) {
      return `"${data}"`;
    } else if (typeIs(data, "number")) {
      return tostring(data);
    } else if (typeIs(data, "boolean")) {
      return tostring(data);
    } else if (typeIs(data, "table")) {
      // Check if it's an array by looking for numeric indices starting at 0
      const dataTable = data as { [key: string | number]: unknown };
      const hasNumericIndices = dataTable[0] !== undefined;
      
      if (hasNumericIndices) {
        // Handle arrays
        const items: string[] = [];
        for (const item of data as unknown[]) {
          items.push(this.dataToLuaString(item));
        }
        return `{${items.join(", ")}}`;
      } else {
        // Handle objects
        const entries: string[] = [];
        for (const [key, value] of pairs(data)) {
          const keyStr = typeIs(key, "string") && key.match("^[%a_][%w_]*$")[0] 
            ? key 
            : `["${key}"]`;
          entries.push(`${keyStr} = ${this.dataToLuaString(value)}`);
        }
        return `{${entries.join(", ")}}`;
      }
    }
    return "nil";
  }
  
  /**
   * Creates a ModuleScript with the generated data
   */
  createDataModule(
    parent: Instance, 
    moduleName: string, 
    data: { persons: Person[]; countries: Country[]; relationships?: any[] }
  ): ModuleScript {
    const moduleScript = new Instance("ModuleScript");
    moduleScript.Name = moduleName;
    moduleScript.Parent = parent;
    
    // Convert data to Lua format
    const luaData = this.dataToLuaString(data);
    
    // Create the module content
    const moduleContent = `-- Generated data for GraphBlaster
-- Generated at: ${os.date("%Y-%m-%d %H:%M:%S")}

local data = ${luaData}

return data`;
    
    // In a real implementation, this would set the Source property
    // For now, we'll store it as a StringValue child
    const sourceValue = new Instance("StringValue");
    sourceValue.Name = "GeneratedSource";
    sourceValue.Value = moduleContent;
    sourceValue.Parent = moduleScript;
    
    print(`Created data module: ${moduleName}`);
    print(`- Persons: ${data.persons.size()}`);
    print(`- Countries: ${data.countries.size()}`);
    if (data.relationships) {
      const relationships = data.relationships as unknown[];
      print(`- Relationships: ${relationships.size()}`);
    }
    
    return moduleScript;
  }
  
  /**
   * Creates a CSV-like StringValue with the data
   */
  createCSVExport(
    parent: Instance,
    fileName: string,
    data: Person[] | Country[]
  ): StringValue {
    const stringValue = new Instance("StringValue");
    stringValue.Name = fileName;
    stringValue.Parent = parent;
    
    if (data.size() === 0) {
      stringValue.Value = "";
      return stringValue;
    }
    
    // Get headers from first item
    const headers: string[] = [];
    const firstItem = data[0];
    for (const [key] of pairs(firstItem)) {
      headers.push(key as string);
    }
    
    // Create CSV content
    const lines: string[] = [headers.join(",")];
    
    for (const item of data) {
      const values: string[] = [];
      for (const header of headers) {
        // Use pairs to iterate through the item
        let value: unknown = undefined;
        for (const [key, val] of pairs(item)) {
          if (key === header) {
            value = val;
            break;
          }
        }
        const stringValue = typeIs(value, "string") 
          ? `"${value.gsub('"', '""')[0]}"` 
          : tostring(value);
        values.push(stringValue);
      }
      lines.push(values.join(","));
    }
    
    stringValue.Value = lines.join("\n");
    
    print(`Created CSV export: ${fileName} (${data.size()} rows)`);
    
    return stringValue;
  }
  
  /**
   * Creates a folder structure with all exported data
   */
  createDataExport(
    parent: Instance,
    exportName: string,
    data: { 
      persons: Person[]; 
      countries: Country[]; 
      relationships?: { person1: string; person2: string; type: string }[] 
    }
  ): Folder {
    const exportFolder = new Instance("Folder");
    exportFolder.Name = exportName;
    exportFolder.Parent = parent;
    
    // Create timestamp
    const timestamp = new Instance("StringValue");
    timestamp.Name = "ExportTimestamp";
    timestamp.Value = os.date("%Y-%m-%d %H:%M:%S");
    timestamp.Parent = exportFolder;
    
    // Create ModuleScript with all data
    this.createDataModule(exportFolder, "AllData", data);
    
    // Create CSV exports
    this.createCSVExport(exportFolder, "persons.csv", data.persons);
    this.createCSVExport(exportFolder, "countries.csv", data.countries);
    
    // Create relationships CSV if provided
    if (data.relationships) {
      const relationshipsData = data.relationships.map(rel => ({
        person1_guid: rel.person1,
        person2_guid: rel.person2,
        relationship_type: rel.type
      }));
      this.createCSVExport(exportFolder, "relationships.csv", relationshipsData as any);
    }
    
    // Create summary
    const summary = new Instance("StringValue");
    summary.Name = "DataSummary";
    summary.Value = `Data Export Summary
==================
Export Time: ${timestamp.Value}
Persons: ${data.persons.size()}
Countries: ${data.countries.size()}
Relationships: ${data.relationships ? data.relationships.size() : 0}

Sample Person:
${data.persons.size() > 0 ? `- Name: ${data.persons[0].firstName} ${data.persons[0].lastName}
- Country: ${data.persons[0].country}
- Pet: ${data.persons[0].petType}` : "No persons generated"}

Sample Country:
${data.countries.size() > 0 ? `- Name: ${data.countries[0].name}
- Sunny: ${data.countries[0].isSunny}
- Warm: ${data.countries[0].isWarm}
- Happiness: ${data.countries[0].happiness}/10
- Expensive: ${data.countries[0].expensive}/10` : "No countries generated"}`;
    summary.Parent = exportFolder;
    
    return exportFolder;
  }
}