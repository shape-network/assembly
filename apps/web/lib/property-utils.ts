import { BlueprintComponent, OtomItem } from './types';

// Maps the PropertyType enum values from IOtomItemsCore.sol
// to the corresponding property path within the OtomItem/Atom types (lib/types.ts)
// and the expected data type for validation.
// NOTE: Assumes atom properties apply to the FIRST atom in giving_atoms.
export type PropertyPath = (string | number)[];

export const PROPERTY_TYPE_MAP: Record<
  number, // Corresponds to PropertyType enum value
  { path: PropertyPath; type: 'number' | 'boolean' | 'string' }
> = {
  // --- Universe Properties (PropertyType 0) ---
  0: { path: ['universeHash'], type: 'string' },
  // --- Molecule Properties (PropertyType 1-8) ---
  1: { path: ['name'], type: 'string' },
  2: { path: ['activation_energy'], type: 'number' },
  3: { path: ['radius'], type: 'number' },
  4: { path: ['electrical_conductivity'], type: 'number' },
  5: { path: ['thermal_conductivity'], type: 'number' },
  6: { path: ['toughness'], type: 'number' },
  7: { path: ['hardness'], type: 'number' },
  8: { path: ['ductility'], type: 'number' },
  // --- Atom Properties (PropertyType 9-14) ---
  9: { path: ['giving_atoms', 0, 'radius'], type: 'number' },
  10: { path: ['giving_atoms', 0, 'volume'], type: 'number' },
  11: { path: ['giving_atoms', 0, 'mass'], type: 'number' },
  12: { path: ['giving_atoms', 0, 'density'], type: 'number' },
  13: { path: ['giving_atoms', 0, 'electronegativity'], type: 'number' },
  14: { path: ['giving_atoms', 0, 'metallic'], type: 'boolean' },
  // --- Nuclear Properties (PropertyType 15-19) ---
  15: { path: ['giving_atoms', 0, 'nucleus', 'protons'], type: 'number' },
  16: { path: ['giving_atoms', 0, 'nucleus', 'neutrons'], type: 'number' },
  17: { path: ['giving_atoms', 0, 'nucleus', 'nucleons'], type: 'number' },
  18: { path: ['giving_atoms', 0, 'nucleus', 'stability'], type: 'number' },
  19: { path: ['giving_atoms', 0, 'nucleus', 'decay_type'], type: 'string' },
};

const PROPERTY_NAME_MAP: Record<number, string> = {
  0: 'Universe Hash',
  1: 'Molecule Name',
  2: 'Activation Energy',
  3: 'Molecule Radius',
  4: 'Electrical Conductivity',
  5: 'Thermal Conductivity',
  6: 'Toughness',
  7: 'Hardness',
  8: 'Ductility',
  9: 'Atom Radius',
  10: 'Volume',
  11: 'Mass',
  12: 'Density',
  13: 'Electronegativity',
  14: 'Metallic',
  15: 'Protons',
  16: 'Neutrons',
  17: 'Nucleons',
  18: 'Stability',
  19: 'Decay Type',
};

export function formatPropertyName(propertyType: number): string {
  return PROPERTY_NAME_MAP[propertyType] ?? `Property ${propertyType}`;
}

// Helper to safely get nested property value with improved typing
export function getNestedValue(obj: Record<string, unknown>, path: PropertyPath): unknown {
  try {
    // Use 'unknown' as initial type for accumulator
    const value = path.reduce((current: unknown, key: string | number) => {
      // Check if current is an object and key is valid before indexing
      if (typeof current === 'object' && current !== null && key in current) {
        return (current as Record<string | number, unknown>)[key];
      }
      return undefined; // Path is invalid or current is not an object
    }, obj as unknown); // Start with the object cast to unknown
    return value;
  } catch (e) {
    console.error('Error accessing property path:', path, e);
    return undefined;
  }
}

export function checkCriteria(item: OtomItem, criteria: BlueprintComponent['criteria']): boolean {
  // Basic validation of inputs
  if (!item || !criteria || criteria.length === 0) {
    console.log('checkCriteria: Invalid item or criteria input.');
    return false;
  }

  // Pre-check: Ensure giving_atoms exists if any criterion needs it
  const needsAtom = criteria.some((c) => {
    const mapping = PROPERTY_TYPE_MAP[c.propertyType];
    // Check if mapping exists and the path starts with 'giving_atoms'
    return mapping?.path?.[0] === 'giving_atoms';
  });

  if (needsAtom && (!item.giving_atoms || item.giving_atoms.length === 0)) {
    console.warn('Criteria requires atom properties, but item has no giving_atoms.');
    return false;
  }

  // Iterate through each criterion
  for (const c of criteria) {
    const mapping = PROPERTY_TYPE_MAP[c.propertyType];
    if (!mapping) {
      console.warn(
        `Unknown propertyType ${c.propertyType} in criteria check. Verify PROPERTY_TYPE_MAP.`
      );
      return false; // Unknown property type fails the check immediately
    }

    const itemValue = getNestedValue(item, mapping.path);

    // --- Strict Check: Value Existence ---
    if (itemValue === undefined || itemValue === null) {
      console.warn(`Property ${String(mapping.path)} not found or is null/undefined on item.`);
      return false; // Missing required property fails the check
    }

    // --- Strict Check: Type Matching & Value Validation ---

    // 1. Number Criteria
    if (mapping.type === 'number') {
      if (typeof itemValue !== 'number') {
        console.warn(
          `Type mismatch for criteria check: Property ${String(mapping.path)} expected number, got ${typeof itemValue}`
        );
        return false; // Type mismatch fails
      }
      // Safe to treat as number now
      try {
        const itemValueBigInt = BigInt(itemValue); // Convert to BigInt for comparison with criteria values
        const min = c.minValue;
        const max = c.maxValue;
        // Check range, minValue/maxValue are bigint from the type
        if (
          (min !== undefined && itemValueBigInt < min) ||
          (max !== undefined && itemValueBigInt > max)
        ) {
          return false; // Range check fails
        }
      } catch (error) {
        console.error(
          `Error converting item value '${itemValue}' to BigInt for comparison at path ${String(mapping.path)}:`,
          error
        );
        return false; // Conversion error fails
      }
    }
    // 2. Boolean Criteria
    else if (mapping.type === 'boolean') {
      if (typeof itemValue !== 'boolean') {
        console.warn(
          `Type mismatch for criteria check: Property ${String(mapping.path)} expected boolean, got ${typeof itemValue}`
        );
        return false; // Type mismatch fails
      }
      // Only check the value if the criterion requires it
      if (c.checkBoolValue && itemValue !== c.boolValue) {
        return false; // Boolean value mismatch fails
      }
    }
    // 3. String Criteria
    else if (mapping.type === 'string') {
      if (typeof itemValue !== 'string') {
        console.warn(
          `Type mismatch for criteria check: Property ${String(mapping.path)} expected string, got ${typeof itemValue}`
        );
        return false; // Type mismatch fails
      }
      // Only check the value if the criterion requires it
      if (c.checkStringValue && itemValue !== c.stringValue) {
        return false; // String value mismatch fails
      }
    }
    // This case should not be reached if PROPERTY_TYPE_MAP types are correct
    else {
      console.error(
        `Unhandled mapping type '${mapping.type}' for property path ${String(mapping.path)}.`
      );
      return false;
    }
  } // End of criteria loop

  // If the loop completes without returning false, all criteria passed
  return true;
}

export function isExactMatchCriteria(criteria: BlueprintComponent['criteria']): boolean {
  if (!criteria || criteria.length === 0) return false;

  // Check if any criteria is an exact match rather than a range check
  return criteria.some((c) => {
    if (c.checkStringValue || c.checkBoolValue || (!c.minValue && !c.maxValue)) {
      return true;
    }

    return false;
  });
}
