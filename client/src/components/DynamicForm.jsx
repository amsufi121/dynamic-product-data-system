// // client/src/components/DynamicForm.jsx

// import React, { useState, useEffect } from 'react';
// import { evaluateConditions } from '../utils/formUtils'; // Import the utility function

// const DynamicForm = ({ onProductAdded }) => {
//   const [questions, setQuestions] = useState([]); // All fetched question definitions
//   const [formData, setFormData] = useState({});   // Current form data being filled out
//   const [currentStep, setCurrentStep] = useState(1); // Current step of the multi-step form
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [submissionSuccess, setSubmissionSuccess] = useState(false);
//   const [submissionError, setSubmissionError] = useState(null);

//   useEffect(() => {
//     const fetchQuestions = async () => {
//       try {
//         const response = await fetch('/api/questions');
//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }
//         const data = await response.json();
//         setQuestions(data);

//         // Initialize formData with default values from questions
//         const initialData = {};
//         data.forEach(q => {
//           if (q.defaultValue !== undefined) {
//             initialData[q.field] = q.defaultValue;
//           } else if (q.type === 'checkbox') {
//             initialData[q.field] = []; // Checkbox group starts as an empty array
//           } else if (q.type === 'boolean') {
//             initialData[q.field] = false; // Boolean fields default to false
//           }
//         });
//         setFormData(initialData);

//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchQuestions();
//   }, []); // Run once on mount to fetch questions

//   // Get unique step numbers from the questions and sort them
//   const uniqueSteps = [...new Set(questions.map(q => q.step))].sort((a, b) => a - b);
//   const totalSteps = uniqueSteps.length;

//   // Filter questions for the current step that are also visible based on conditions
//   const currentStepQuestions = questions.filter(
//     q => q.step === currentStep && evaluateConditions(q.conditions, formData)
//   );

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;

//     setFormData(prevData => {
//       let newValue;
//       if (type === 'checkbox') {
//         // Handle multiple checkboxes for the same field (if implemented as array)
//         if (Array.isArray(prevData[name])) {
//             newValue = checked
//                 ? [...prevData[name], value]
//                 : prevData[name].filter(item => item !== value);
//         } else { // Handle single checkbox for a boolean field
//             newValue = checked;
//         }
//       } else if (type === 'radio') {
//         newValue = value; // Radio button value
//       } else if (type === 'number') {
//         newValue = Number(value); // Convert to number
//       } else if (type === 'date') {
//         newValue = value; // Date string
//       } else {
//         newValue = value;
//       }

//       const updatedData = {
//         ...prevData,
//         [name]: newValue
//       };

//       // If a field with conditions changes, we might need to clear values of newly hidden fields
//       // This is a simple approach, more sophisticated recursive clearing might be needed for complex logic
//       questions.forEach(q => {
//           if (q.conditions && q.conditions.length > 0) {
//               const isVisibleNow = evaluateConditions(q.conditions, updatedData);
//               // If a question was previously visible but is now hidden due to this change
//               // and its value is not empty, reset it.
//               // We reset to undefined or default value, but for now undefined is fine.
//               if (!isVisibleNow && updatedData[q.field] !== undefined) {
//                   delete updatedData[q.field]; // Remove the value from formData
//               }
//           }
//       });

//       return updatedData;
//     });
//   };

//   const handleNext = () => {
//     // Basic validation for current step
//     const hasErrors = currentStepQuestions.some(q => q.required && !formData[q.field]);
//     if (hasErrors) {
//         alert('Please fill out all required fields in the current step.');
//         return;
//     }
//     if (currentStep < totalSteps) {
//       setCurrentStep(prevStep => prevStep + 1);
//     }
//   };

//   const handleBack = () => {
//     if (currentStep > 1) {
//       setCurrentStep(prevStep => prevStep - 1);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSubmissionLoading(true);
//     setSubmissionError(null);
//     setSubmissionSuccess(false);

//     // Final validation before submission (check all currently visible required fields)
//     const allVisibleRequiredQuestions = questions.filter(
//         q => q.required && evaluateConditions(q.conditions, formData)
//     );
//     const hasFinalErrors = allVisibleRequiredQuestions.some(q => !formData[q.field]);
//     if (hasFinalErrors) {
//         alert('Please fill out all required fields before submitting.');
//         setSubmissionLoading(false);
//         return;
//     }

//     try {
//         // Construct the final product data by combining core product fields with dynamic ones
//         const productData = {
//             ...formData,
//             // Example of mapping form data to core Product schema fields
//             // For now, we assume dynamic form fields directly map to Product schema if they exist,
//             // or are added as extra properties. We'll refine this later.
//             // For now, let's ensure 'name', 'sku', 'price', 'category', 'stockQuantity' are present
//             // from the dynamic form if they match our Product schema.
//             // Our current example questions are 'category', 'materialType', etc.
//             // We need to ensure core Product fields like 'name', 'sku', 'price', 'stockQuantity' are captured.
//             // For this version, let's assume the question definitions include these core fields too.
//         };

//         const response = await fetch('/api/products', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify(productData),
//         });

//         if (!response.ok) {
//             const errorData = await response.json();
//             throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
//         }

//         const newProduct = await response.json();
//         setSubmissionSuccess(true);
//         onProductAdded(newProduct); // Notify parent component

//         // Reset form after submission
//         setFormData({});
//         setCurrentStep(1);
//         // Re-initialize default values from questions after reset
//         const initialData = {};
//         questions.forEach(q => {
//           if (q.defaultValue !== undefined) {
//             initialData[q.field] = q.defaultValue;
//           } else if (q.type === 'checkbox') {
//             initialData[q.field] = [];
//           } else if (q.type === 'boolean') {
//             initialData[q.field] = false;
//           }
//         });
//         setFormData(initialData);

//         console.log('Product added dynamically:', newProduct);
//     } catch (err) {
//         setSubmissionError(err.message);
//         console.error('Error submitting dynamic product:', err);
//     } finally {
//         setSubmissionLoading(false);
//     }
//   };

//   if (loading) {
//     return <p>Loading form configuration...</p>;
//   }

//   if (error) {
//     return <p style={{ color: 'red' }}>Error loading form: {error}</p>;
//   }

//   return (
//     <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
//       <h2>Dynamic Product Form (Step {currentStep} of {totalSteps})</h2>
//       <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '15px' }}>
//         {currentStepQuestions.length > 0 ? (
//           currentStepQuestions.map((q) => (
//             <div key={q.field} style={{ marginBottom: '10px' }}>
//               <label htmlFor={q.field} style={{ display: 'block', fontWeight: 'bold' }}>
//                 {q.label} {q.required && <span style={{ color: 'red' }}>*</span>}
//               </label>
//               {/* Render input based on question type */}
//               {q.type === 'text' && (
//                 <input
//                   type="text"
//                   id={q.field}
//                   name={q.field}
//                   value={formData[q.field] || ''}
//                   onChange={handleChange}
//                   placeholder={q.placeholder}
//                   required={q.required}
//                   style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
//                 />
//               )}
//               {q.type === 'textarea' && (
//                 <textarea
//                   id={q.field}
//                   name={q.field}
//                   value={formData[q.field] || ''}
//                   onChange={handleChange}
//                   placeholder={q.placeholder}
//                   required={q.required}
//                   rows="4"
//                   style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
//                 ></textarea>
//               )}
//               {q.type === 'number' && (
//                 <input
//                   type="number"
//                   id={q.field}
//                   name={q.field}
//                   value={formData[q.field] || ''}
//                   onChange={handleChange}
//                   placeholder={q.placeholder}
//                   required={q.required}
//                   step="any" // Allows decimal numbers
//                   style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
//                 />
//               )}
//               {q.type === 'date' && (
//                 <input
//                   type="date"
//                   id={q.field}
//                   name={q.field}
//                   value={formData[q.field] || ''}
//                   onChange={handleChange}
//                   required={q.required}
//                   style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
//                 />
//               )}
//               {q.type === 'select' && (
//                 <select
//                   id={q.field}
//                   name={q.field}
//                   value={formData[q.field] || ''}
//                   onChange={handleChange}
//                   required={q.required}
//                   style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
//                 >
//                   <option value="">{q.placeholder || 'Select an option'}</option>
//                   {q.options.map(option => (
//                     <option key={option.value} value={option.value}>{option.label}</option>
//                   ))}
//                 </select>
//               )}
//               {q.type === 'radio' && (
//                 <div style={{ display: 'flex', gap: '15px', marginTop: '5px' }}>
//                   {q.options.map(option => (
//                     <label key={option.value} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
//                       <input
//                         type="radio"
//                         name={q.field}
//                         value={option.value}
//                         checked={formData[q.field] === option.value}
//                         onChange={handleChange}
//                         required={q.required}
//                       />
//                       {option.label}
//                     </label>
//                   ))}
//                 </div>
//               )}
//               {q.type === 'checkbox' && (
//                 // Assuming checkbox type represents a single boolean value for now
//                 // For multiple selections, formData[q.field] would be an array
//                 <label style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '5px' }}>
//                     <input
//                         type="checkbox"
//                         name={q.field}
//                         checked={!!formData[q.field]} // Convert to boolean
//                         onChange={(e) => handleChange({ target: { name: q.field, value: e.target.checked, type: 'checkbox' } })}
//                         required={q.required}
//                     />
//                     {q.label} {/* Label for the checkbox itself, not for options */}
//                 </label>
//               )}
//               {q.type === 'boolean' && (
//                 <label style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '5px' }}>
//                     <input
//                         type="checkbox"
//                         name={q.field}
//                         checked={!!formData[q.field]} // Ensures it's a boolean
//                         onChange={(e) => handleChange({ target: { name: q.field, value: e.target.checked, type: 'boolean' } })}
//                         required={q.required}
//                     />
//                     {q.label}
//                 </label>
//               )}
//             </div>
//           ))
//         ) : (
//           <p>No questions configured for this step, or all are hidden.</p>
//         )}

//         <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
//           {currentStep > 1 && (
//             <button type="button" onClick={handleBack} style={{ padding: '10px 15px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
//               Back
//             </button>
//           )}
//           {currentStep < totalSteps ? (
//             <button type="button" onClick={handleNext} style={{ padding: '10px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginLeft: 'auto' }}>
//               Next
//             </button>
//           ) : (
//             <button type="submit" disabled={setSubmissionLoading} style={{ padding: '10px 15px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginLeft: 'auto' }}>
//               {setSubmissionLoading ? 'Submitting...' : 'Submit Product'}
//             </button>
//           )}
//         </div>
//       </form>
//       {submissionSuccess && <p style={{ color: 'green' }}>Product added successfully!</p>}
//       {submissionError && <p style={{ color: 'red' }}>Error: {submissionError}</p>}
//     </div>
//   );
// };

// export default DynamicForm;
