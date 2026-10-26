/**
 * Component Schema Validator for MoodUI Studio
 * Ensures all components conform to the structured AST schema.
 */

export const SUPPORTED_COMPONENT_TYPES = [
  'page',
  'navbar',
  'hero',
  'features',
  'card-grid',
  'card',
  'text-block',
  'heading',
  'paragraph',
  'button',
  'image',
  'form',
  'input',
  'testimonials',
  'cta',
  'footer'
];

export function validateComponent(component) {
  if (!component || typeof component !== 'object') {
    return { valid: false, error: 'Component must be an object' };
  }

  if (!component.id || typeof component.id !== 'string') {
    return { valid: false, error: 'Component missing required "id" string' };
  }

  if (!component.type || !SUPPORTED_COMPONENT_TYPES.includes(component.type)) {
    return { 
      valid: false, 
      error: `Unsupported component type "${component.type}". Supported types: ${SUPPORTED_COMPONENT_TYPES.join(', ')}` 
    };
  }

  if (component.props && typeof component.props !== 'object') {
    return { valid: false, error: 'Component props must be an object' };
  }

  if (component.style && typeof component.style !== 'object') {
    return { valid: false, error: 'Component style must be an object' };
  }

  if (component.children) {
    if (!Array.isArray(component.children)) {
      return { valid: false, error: 'Component children must be an array' };
    }
    for (const child of component.children) {
      const childValidation = validateComponent(child);
      if (!childValidation.valid) {
        return childValidation;
      }
    }
  }

  return { valid: true };
}

export function validateComponentTree(components) {
  if (!Array.isArray(components)) {
    return { valid: false, error: 'Component tree must be an array' };
  }

  for (const comp of components) {
    const res = validateComponent(comp);
    if (!res.valid) return res;
  }

  return { valid: true };
}

export function validatePatch(patch) {
  if (!patch || typeof patch !== 'object') {
    return { valid: false, error: 'Patch must be an object' };
  }

  const validOperations = ['update-props', 'update-style', 'add-component', 'remove-component', 'replace-component', 'reorder-component'];
  if (!validOperations.includes(patch.operation)) {
    return { valid: false, error: `Invalid patch operation "${patch.operation}". Must be one of: ${validOperations.join(', ')}` };
  }

  if (!patch.targetId && patch.operation !== 'add-component') {
    return { valid: false, error: 'Patch requires "targetId"' };
  }

  return { valid: true };
}
