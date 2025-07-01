// TailwindCSS style objects for consistent styling across the application

// Layout and Navigation Styles
export const layoutStyles = {
  container: {
    minHeight: '100vh',
    backgroundColor: 'rgb(249, 250, 251)', // bg-gray-50
  },
  navbar: {
    backgroundColor: 'rgb(255, 255, 255)', // bg-white
    borderBottom: '1px solid rgb(229, 231, 235)', // border-gray-200
    padding: '1rem 2rem', // px-8 py-4
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)', // shadow-sm
  },
  navLinks: {
    display: 'flex',
    gap: '2rem', // space-x-8
  },
  navLink: {
    color: 'rgb(75, 85, 99)', // text-gray-600
    textDecoration: 'none',
    fontWeight: '500', // font-medium
    padding: '0.5rem 1rem', // px-4 py-2
    borderRadius: '0.375rem', // rounded-md
    transition: 'all 0.15s ease-in-out',
    ':hover': {
      color: 'rgb(59, 130, 246)', // text-blue-500
      backgroundColor: 'rgb(239, 246, 255)', // bg-blue-50
    },
  },
  navLinkActive: {
    color: 'rgb(59, 130, 246)', // text-blue-500
    backgroundColor: 'rgb(239, 246, 255)', // bg-blue-50
    fontWeight: '600', // font-semibold
  },
  title: {
    fontSize: '1.5rem', // text-2xl
    fontWeight: '700', // font-bold
    color: 'rgb(17, 24, 39)', // text-gray-900
  },
  main: {
    padding: '2rem', // p-8
    maxWidth: '100%',
    width: '100%',
  },
};

// Data Grid Styles
export const dataGridStyles = {
  container: {
    backgroundColor: 'rgb(255, 255, 255)', // bg-white
    borderRadius: '0.5rem', // rounded-lg
    border: '1px solid rgb(229, 231, 235)', // border-gray-200
    boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)', // shadow-sm
    overflow: 'hidden',
  },
  header: {
    padding: '1.5rem 2rem', // px-8 py-6
    borderBottom: '1px solid rgb(229, 231, 235)', // border-b border-gray-200
    backgroundColor: 'rgb(249, 250, 251)', // bg-gray-50
  },
  headerTitle: {
    fontSize: '1.25rem', // text-xl
    fontWeight: '600', // font-semibold
    color: 'rgb(17, 24, 39)', // text-gray-900
    marginBottom: '0.5rem', // mb-2
  },
  headerSubtitle: {
    fontSize: '0.875rem', // text-sm
    color: 'rgb(107, 114, 128)', // text-gray-500
  },
  grid: {
    height: '600px',
    width: '100%',
    border: 'none',
    '& .MuiDataGrid-root': {
      border: 'none',
    },
    '& .MuiDataGrid-cell': {
      borderBottom: '1px solid rgb(243, 244, 246)', // border-gray-100
      padding: '0.75rem', // p-3
    },
    '& .MuiDataGrid-columnHeaders': {
      backgroundColor: 'rgb(249, 250, 251)', // bg-gray-50
      borderBottom: '1px solid rgb(229, 231, 235)', // border-gray-200
      fontSize: '0.875rem', // text-sm
      fontWeight: '600', // font-semibold
      color: 'rgb(55, 65, 81)', // text-gray-700
    },
    '& .MuiDataGrid-row:hover': {
      backgroundColor: 'rgb(249, 250, 251)', // bg-gray-50
    },
    '& .MuiDataGrid-row:nth-of-type(even)': {
      backgroundColor: 'rgb(255, 255, 255)', // bg-white
    },
    '& .MuiDataGrid-row:nth-of-type(odd)': {
      backgroundColor: 'rgb(249, 250, 251)', // bg-gray-50
    },
  },
  pagination: {
    borderTop: '1px solid rgb(229, 231, 235)', // border-t border-gray-200
    backgroundColor: 'rgb(249, 250, 251)', // bg-gray-50
    padding: '1rem 2rem', // px-8 py-4
  },
};

// Pivot Table Styles
export const pivotTableStyles = {
  container: {
    backgroundColor: 'rgb(255, 255, 255)', // bg-white
    borderRadius: '0.5rem', // rounded-lg
    border: '1px solid rgb(229, 231, 235)', // border-gray-200
    boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)', // shadow-sm
    overflow: 'hidden',
  },
  header: {
    padding: '1.5rem 2rem', // px-8 py-6
    borderBottom: '1px solid rgb(229, 231, 235)', // border-b border-gray-200
    backgroundColor: 'rgb(249, 250, 251)', // bg-gray-50
  },
  headerTitle: {
    fontSize: '1.25rem', // text-xl
    fontWeight: '600', // font-semibold
    color: 'rgb(17, 24, 39)', // text-gray-900
    marginBottom: '0.5rem', // mb-2
  },
  headerSubtitle: {
    fontSize: '0.875rem', // text-sm
    color: 'rgb(107, 114, 128)', // text-gray-500
  },
  content: {
    padding: '2rem', // p-8
    minHeight: '500px',
  },
  pivotTable: {
    '& .pvtTable': {
      fontSize: '0.875rem', // text-sm
      borderCollapse: 'collapse',
      width: '100%',
    },
    '& .pvtTable th': {
      backgroundColor: 'rgb(249, 250, 251)', // bg-gray-50
      border: '1px solid rgb(229, 231, 235)', // border-gray-200
      padding: '0.5rem 0.75rem', // px-3 py-2
      fontWeight: '600', // font-semibold
      color: 'rgb(55, 65, 81)', // text-gray-700
    },
    '& .pvtTable td': {
      border: '1px solid rgb(229, 231, 235)', // border-gray-200
      padding: '0.5rem 0.75rem', // px-3 py-2
      color: 'rgb(17, 24, 39)', // text-gray-900
    },
  },
};

// Button Styles
export const buttonStyles = {
  primary: {
    backgroundColor: 'rgb(59, 130, 246)', // bg-blue-500
    color: 'rgb(255, 255, 255)', // text-white
    padding: '0.5rem 1rem', // px-4 py-2
    borderRadius: '0.375rem', // rounded-md
    border: 'none',
    fontSize: '0.875rem', // text-sm
    fontWeight: '500', // font-medium
    cursor: 'pointer',
    transition: 'all 0.15s ease-in-out',
    ':hover': {
      backgroundColor: 'rgb(37, 99, 235)', // bg-blue-600
    },
    ':focus': {
      outline: 'none',
      boxShadow: '0 0 0 3px rgb(147, 197, 253)', // ring-2 ring-blue-300
    },
  },
  secondary: {
    backgroundColor: 'rgb(255, 255, 255)', // bg-white
    color: 'rgb(55, 65, 81)', // text-gray-700
    padding: '0.5rem 1rem', // px-4 py-2
    borderRadius: '0.375rem', // rounded-md
    border: '1px solid rgb(209, 213, 219)', // border-gray-300
    fontSize: '0.875rem', // text-sm
    fontWeight: '500', // font-medium
    cursor: 'pointer',
    transition: 'all 0.15s ease-in-out',
    ':hover': {
      backgroundColor: 'rgb(249, 250, 251)', // bg-gray-50
    },
    ':focus': {
      outline: 'none',
      boxShadow: '0 0 0 3px rgb(147, 197, 253)', // ring-2 ring-blue-300
    },
  },
};

// Card Styles
export const cardStyles = {
  base: {
    backgroundColor: 'rgb(255, 255, 255)', // bg-white
    borderRadius: '0.5rem', // rounded-lg
    border: '1px solid rgb(229, 231, 235)', // border-gray-200
    boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)', // shadow-sm
    padding: '1.5rem', // p-6
  },
  header: {
    marginBottom: '1rem', // mb-4
  },
  title: {
    fontSize: '1.125rem', // text-lg
    fontWeight: '600', // font-semibold
    color: 'rgb(17, 24, 39)', // text-gray-900
    marginBottom: '0.25rem', // mb-1
  },
  subtitle: {
    fontSize: '0.875rem', // text-sm
    color: 'rgb(107, 114, 128)', // text-gray-500
  },
  content: {
    color: 'rgb(55, 65, 81)', // text-gray-700
  },
};

// Loading Styles
export const loadingStyles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px',
    color: 'rgb(107, 114, 128)', // text-gray-500
  },
  spinner: {
    width: '2rem', // w-8
    height: '2rem', // h-8
    border: '2px solid rgb(229, 231, 235)', // border-gray-200
    borderTop: '2px solid rgb(59, 130, 246)', // border-t-blue-500
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginRight: '0.5rem', // mr-2
  },
  text: {
    fontSize: '0.875rem', // text-sm
    fontWeight: '500', // font-medium
  },
};

// Responsive breakpoints (for reference)
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

// Color palette (for reference)
export const colors = {
  gray: {
    50: 'rgb(249, 250, 251)',
    100: 'rgb(243, 244, 246)',
    200: 'rgb(229, 231, 235)',
    300: 'rgb(209, 213, 219)',
    400: 'rgb(156, 163, 175)',
    500: 'rgb(107, 114, 128)',
    600: 'rgb(75, 85, 99)',
    700: 'rgb(55, 65, 81)',
    800: 'rgb(31, 41, 55)',
    900: 'rgb(17, 24, 39)',
  },
  blue: {
    50: 'rgb(239, 246, 255)',
    100: 'rgb(219, 234, 254)',
    200: 'rgb(191, 219, 254)',
    300: 'rgb(147, 197, 253)',
    400: 'rgb(96, 165, 250)',
    500: 'rgb(59, 130, 246)',
    600: 'rgb(37, 99, 235)',
    700: 'rgb(29, 78, 216)',
    800: 'rgb(30, 64, 175)',
    900: 'rgb(30, 58, 138)',
  },
}; 