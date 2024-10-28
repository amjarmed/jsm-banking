# custom notes for commenting

- Use Comments Sparingly : variables, functions, classes, componetns, etc.

- Explain “Why” Rather Than “What” :
- Use JSDoc for Functions and Components :

```js
/** ... */
```

- Keep Comments Updated

- Use Consistent Commenting Style

- examples :

```js
//1- Component Comments
// UserProfile component - Renders the profile information for a user

// 2 - JSDoc for Functions and Components
/**
 * UserProfile component renders user information
 * @param {Object} props - The component props
 * @param {Object} props.user - The user data
 * @param {string} props.user.name - The user's name
 * @param {string} props.user.email - The user's email
 */

function UserProfile({ user }) {}

// 3- Section Comments
function Dashboard() {
  // State variables
  const [data, setData] = useState(null);

  // Fetch data on mount
  useEffect(() => {
    // Fetching user data from API
    fetchData().then(setData);
  }, []);

  // Render component
  return <div>{data ? <DataDisplay data={data} /> : 'Loading...'}</div>;
}

// 4- Conditional and Logic Comments

// Show loading spinner while fetching data
if (isLoading) {
  return <Spinner />;
}
// Display error message if there's an error
if (error) {
  return <Error message='Failed to load data.' />;
}

// 5- To-Do Comments

// TODO: Add form validation
const handleSubmit = (e) => {
  e.preventDefault();
  // form submission logic
};

// 6- Explain Hacks or Workarounds

// Workaround: Delay rendering to avoid hydration mismatch in Next.js SSR
const [isMounted, setIsMounted] = useState(false);
useEffect(() => {
  setIsMounted(true);
}, []);

// 7- Commenting JSX Props
<Button
  onClick={handleSave} // Save the data to the server
  disabled={!isFormValid} // Disable if form is invalid
  variant='primary' // Styling variant
>
  Save
</Button>;
```

- Commenting Style for Next.js and React

```js
// 1- File-Level Comments
// Layout.js - Defines the main layout for all pages
export default function Layout({ children }) {
  return <div>{children}</div>;
}

// 2- Use // for Inline Comments and Short Explanations

const handleSubmit = (e) => {
  e.preventDefault(); // Prevent page reload on form submission
  submitFormData();
};

// 3- Use /** ... */ for Block Comments

/**
 * Fetches user data from the API and handles state updates
 * - Step 1: Make the API call
 * - Step 2: Parse the response and set state
 * - Step 3: Handle errors and show error message
 */
const fetchUserData = async () => {
  try {
    const response = await fetch('/api/user');
    const data = await response.json();
    setUserData(data);
  } catch (error) {
    setError(true);
  }
};
```
