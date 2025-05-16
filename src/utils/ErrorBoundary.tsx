// import React from 'react';

// class ErrorBoundary extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = { hasError: false, error: null, errorInfo: null };
//   }

//   static getDerivedStateFromError(error) {
//     // Update state so the next render will show the fallback UI.
//     return { hasError: true };
//   }

//   componentDidCatch(error, errorInfo) {
//     // You can also log the error to an error reporting service
//     console.error("React Error Boundary caught an error:", error, errorInfo);
//     this.setState({
//       error: error,
//       errorInfo: errorInfo
//     });
//   }

//   render() {
//     if (this.state.hasError) {
//       // You can render any custom fallback UI
//       return (
//         <div className="p-6 bg-red-50 border border-red-200 rounded-lg shadow-sm">
//           <h2 className="text-xl font-bold text-red-700 mb-4">Something went wrong</h2>
//           <details className="bg-white p-4 rounded-lg text-gray-800 text-sm overflow-auto max-h-96">
//             <summary className="text-red-600 font-medium cursor-pointer mb-2">
//               View error details
//             </summary>
//             <p className="mb-2 font-mono">{this.state.error && this.state.error.toString()}</p>
//             <pre className="whitespace-pre-wrap font-mono text-xs bg-gray-100 p-2 rounded">
//               {this.state.errorInfo && this.state.errorInfo.componentStack}
//             </pre>
//           </details>
//         </div>
//       );
//     }

//     return this.props.children; 
//   }
// }

// export default ErrorBoundary;