// // client/src/utils/formUtils.js

// // Function to evaluate if a question should be visible based on its conditions
// export const evaluateConditions = (conditions, formData) => {
//   if (!conditions || conditions.length === 0) {
//     return true; // No conditions means the question is always visible
//   }

//   // All conditions must be true for the question to be visible
//   return conditions.every((condition) => {
//     const fieldValue = formData[condition.field]; // Value of the field being checked
//     const conditionValue = condition.value; // Value to compare against

//     // Handle cases where the field to check is not yet in formData or is undefined/null
//     if (fieldValue === undefined || fieldValue === null || fieldValue === "") {
//       return false;
//     }

//     switch (condition.operator) {
//       case "equals":
//         // For array values (like checkboxes), check if any selected option equals the condition value
//         if (Array.isArray(fieldValue)) {
//           return fieldValue.includes(conditionValue);
//         }
//         return (
//           String(fieldValue).toLowerCase() ===
//           String(conditionValue).toLowerCase()
//         );
//       case "not_equals":
//         if (Array.isArray(fieldValue)) {
//           return !fieldValue.includes(conditionValue);
//         }
//         return (
//           String(fieldValue).toLowerCase() !==
//           String(conditionValue).toLowerCase()
//         );
//       case "in":
//         // Checks if the field's value is present in the condition's array value
//         if (!Array.isArray(conditionValue)) {
//           console.warn(
//             `Condition 'in' operator used with non-array value for field '${condition.field}'.`
//           );
//           return false;
//         }
//         if (Array.isArray(fieldValue)) {
//           // If field value is also an array (e.g., multiple checkboxes),
//           // check if any of its values are in the conditionValue array
//           return fieldValue.some((val) => conditionValue.includes(val));
//         }
//         return conditionValue.includes(fieldValue);
//       case "not_in":
//         if (!Array.isArray(conditionValue)) {
//           console.warn(
//             `Condition 'not_in' operator used with non-array value for field '${condition.field}'.`
//           );
//           return false;
//         }
//         if (Array.isArray(fieldValue)) {
//           return !fieldValue.every((val) => conditionValue.includes(val));
//         }
//         return !conditionValue.includes(fieldValue);
//       case "greater_than":
//         return parseFloat(fieldValue) > parseFloat(conditionValue);
//       case "less_than":
//         return parseFloat(fieldValue) < parseFloat(conditionValue);
//       default:
//         console.warn(`Unknown condition operator: ${condition.operator}`);
//         return false;
//     }
//   });
// };
