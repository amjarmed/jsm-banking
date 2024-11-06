/* eslint-disable no-prototype-builtins */
import { type ClassValue, clsx } from 'clsx';
import qs from 'query-string';
import { twMerge } from 'tailwind-merge';
import { z } from 'zod';

/**
 * A shortcut for `twMerge(clsx(...inputs))` that merges the input classnames
 * into a single string.
 *
 * @param inputs - A list of classnames to merge.
 *
 * @returns A single string of merged classnames.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a given Date object into various string representations
 * based on different formatting options.
 *
 * @param dateString - The Date object to be formatted.
 *
 * @returns An object containing formatted date and time strings:
 *   - dateTime: A string with abbreviated weekday, month, day, hour, and minute in 12-hour format.
 *   - dateDay: A string with abbreviated weekday, 2-digit month, and numeric year.
 *   - dateOnly: A string with abbreviated month, numeric day, and year.
 *   - timeOnly: A string with numeric hour and minute in 12-hour format.
 */
export const formatDateTime = (dateString: Date) => {
  const dateTimeOptions: Intl.DateTimeFormatOptions = {
    weekday: 'short', // abbreviated weekday name (e.g., 'Mon')
    month: 'short', // abbreviated month name (e.g., 'Oct')
    day: 'numeric', // numeric day of the month (e.g., '25')
    hour: 'numeric', // numeric hour (e.g., '8')
    minute: 'numeric', // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  };

  const dateDayOptions: Intl.DateTimeFormatOptions = {
    weekday: 'short', // abbreviated weekday name (e.g., 'Mon')
    year: 'numeric', // numeric year (e.g., '2023')
    month: '2-digit', // abbreviated month name (e.g., 'Oct')
    day: '2-digit', // numeric day of the month (e.g., '25')
  };

  const dateOptions: Intl.DateTimeFormatOptions = {
    month: 'short', // abbreviated month name (e.g., 'Oct')
    year: 'numeric', // numeric year (e.g., '2023')
    day: 'numeric', // numeric day of the month (e.g., '25')
  };

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: 'numeric', // numeric hour (e.g., '8')
    minute: 'numeric', // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  };

  const formattedDateTime: string = new Date(dateString).toLocaleString(
    'en-US',
    dateTimeOptions,
  );

  const formattedDateDay: string = new Date(dateString).toLocaleString(
    'en-US',
    dateDayOptions,
  );

  const formattedDate: string = new Date(dateString).toLocaleString(
    'en-US',
    dateOptions,
  );

  const formattedTime: string = new Date(dateString).toLocaleString(
    'en-US',
    timeOptions,
  );

  return {
    dateTime: formattedDateTime,
    dateDay: formattedDateDay,
    dateOnly: formattedDate,
    timeOnly: formattedTime,
  };
};

/**
 * Format a number as a USD amount, with two decimal places.
 *
 * @example
 * formatAmount(1234) // "$1,234.00"
 * @example
 * formatAmount(-5678) // "-$5,678.00"
 *
 * @param {number} amount
 * @returns {string}
 */

export function formatAmount(amount: number): string {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  });

  return formatter.format(amount);
}

/**
 * Converts a value to a JSON string and then parses it back to a JavaScript object.
 * This process can be used to deep clone simple objects, but be aware that it may
 * not work for objects containing functions, undefined, or circular references.
 *
 * @param {unknown} value - The value to be cloned.
 * @returns {any} - A new object that is a clone of the input value.
 */
export const parseStringify = (value: unknown) =>
  JSON.parse(JSON.stringify(value));

/**
 * Removes all special characters from a string, leaving only alphanumeric
 * characters and whitespace. This is useful for normalizing strings before
 * comparing them.
 *
 * @example
 * removeSpecialCharacters('Hello, World!') // "Hello World"
 * @example
 * removeSpecialCharacters('The quick brown fox jumps over the lazy dog!')
 *   // "The quick brown fox jumps over the lazy dog"
 *
 * @param {string} value - The string to be normalized.
 * @returns {string} - The normalized string.
 */
export const removeSpecialCharacters = (value: string) => {
  return value.replace(/[^\w\s]/gi, '');
};

/**
 * Modifies a URL's query parameters by updating or adding a specified key-value pair,
 * then returns the updated URL as a string.
 *
 * @param {UrlQueryParams} paramsObject - An object containing the URL parameters.
 * @param {string} paramsObject.params - The current query parameters in string format.
 * @param {string} paramsObject.key - The key to be updated or added in the query parameters.
 * @param {string} paramsObject.value - The value associated with the key.
 * @returns {string} - The updated URL with the modified query parameters.
 */
interface UrlQueryParams {
  params: string;
  key: string;
  value: string;
}
export function formUrlQuery({ params, key, value }: UrlQueryParams) {
  const currentUrl = qs.parse(params);

  currentUrl[key] = value;

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true },
  );
}

/**
 * Returns an object containing tailwind CSS classes for styling account
 * components based on the provided account type.
 *
 * @param {AccountTypes} type - The type of account to be styled.
 * @returns {Record<string, string>} - An object containing four properties:
 *   - bg: The background color class for the account component.
 *   - lightBg: The background color class for the account component's
 *     lighter variant.
 *   - title: The text color class for the account title.
 *   - subText: The text color class for the account's subtext.
 */
export function getAccountTypeColors(type: AccountTypes) {
  switch (type) {
    case 'depository':
      return {
        bg: 'bg-blue-25',
        lightBg: 'bg-blue-100',
        title: 'text-blue-900',
        subText: 'text-blue-700',
      };

    case 'credit':
      return {
        bg: 'bg-success-25',
        lightBg: 'bg-success-100',
        title: 'text-success-900',
        subText: 'text-success-700',
      };

    default:
      return {
        bg: 'bg-green-25',
        lightBg: 'bg-green-100',
        title: 'text-green-900',
        subText: 'text-green-700',
      };
  }
}

/* 
export function countTransactionCategories(
  transactions: Transaction[],
): CategoryCount[] {
  const categoryCounts: { [category: string]: number } = {};
  let totalCount = 0;

  // Iterate over each transaction
  transactions &&
    transactions.forEach((transaction) => {
      // Extract the category from the transaction
      const category = transaction.category;

      // If the category exists in the categoryCounts object, increment its count
      if (categoryCounts.hasOwnProperty(category)) {
        categoryCounts[category]++;
      } else {
        // Otherwise, initialize the count to 1
        categoryCounts[category] = 1;
      }

      // Increment total count
      totalCount++;
    });

  // Convert the categoryCounts object to an array of objects
  const aggregatedCategories: CategoryCount[] = Object.keys(categoryCounts).map(
    (category) => ({
      name: category,
      count: categoryCounts[category],
      totalCount,
    }),
  );

  // Sort the aggregatedCategories array by count in descending order
  aggregatedCategories.sort((a, b) => b.count - a.count);

  return aggregatedCategories;
}
 */

/**
 * Extracts the customer ID from the given URL.
 * @param {string} url
 * @returns {string} The customer ID.
 */
export function extractCustomerIdFromUrl(url: string) {
  // Split the URL string by '/'
  const parts = url.split('/');

  // Extract the last part, which represents the customer ID
  const customerId = parts[parts.length - 1];

  return customerId;
}

/**
 * Encrypts a given string ID using Base64 encoding.
 *
 * @param {string} id - The ID to be encrypted.
 * @returns {string} - The Base64 encoded representation of the ID.
 */
export function encryptId(id: string) {
  return btoa(id);
}

/**
 * Decrypts a given Base64 encoded string ID.
 * @param {string} id - The Base64 encoded representation of the ID.
 * @returns {string} - The decrypted ID.
 */
export function decryptId(id: string) {
  return atob(id);
}

/**
 * Determines the status of a transaction based on the given date.
 *
 * If the given date is more than 2 days ago, the status is 'Success', otherwise it is 'Processing'.
 *
 * @param {Date} date - The date of the transaction.
 * @returns {string} - The status of the transaction.
 */
export const getTransactionStatus = (date: Date) => {
  const today = new Date();
  const twoDaysAgo = new Date(today);
  twoDaysAgo.setDate(today.getDate() - 2);

  return date > twoDaysAgo ? 'Processing' : 'Success';
};

/**
 * Generates a Zod schema for authentication forms, dynamically adjusting
 * field requirements based on the form type ('sign-in' or 'sign-up').
 *
 * For 'sign-up', all fields are required with minimum lengths for strings.
 * For 'sign-in', only email and password are required, while other fields
 * are optional.
 *
 * @param {string} type - The type of authentication form ('sign-in' or 'sign-up').
 *
 * @returns {ZodSchema} - A Zod schema object with validation rules for form fields:
 *   - firstName, lastName, address1, state, city, postalCode, dateOfBirth, ssn:
 *     Optional for 'sign-in'; Required with min length 2 for 'sign-up'.
 *   - email: Required, must be a valid email format.
 *   - password: Required, must be at least 8 characters long.
 */
export const AuthFormSchema = (type: string) =>
  z.object({
    // for signup
    firstName:
      type === 'sign-in'
        ? z.string().optional()
        : z.string().min(2, { message: 'First name is required' }),
    lastName:
      type === 'sign-in'
        ? z.string().optional()
        : z.string().min(2, { message: 'Last name is required' }),
    address1:
      type === 'sign-in'
        ? z.string().optional()
        : z.string().min(5, { message: 'Address is required' }),
    state:
      type === 'sign-in'
        ? z.string().optional()
        : z
            .string()
            .length(2, { message: 'State must be 2 characters' })
            .default('NY'),
    city:
      type === 'sign-in'
        ? z.string().optional()
        : z.string().min(2, { message: 'City is required' }),
    postalCode:
      type === 'sign-in'
        ? z.string().optional()
        : z
            .string()
            .length(5, { message: 'Postal code must be 5 digits' })
            .regex(/^\d{5}$/, { message: 'Postal code must be numeric' }),
    dateOfBirth:
      type === 'sign-in'
        ? z.string().optional()
        : z.string().min(10, { message: 'Date of birth is required' }),
    ssn:
      type === 'sign-in'
        ? z.string().optional()
        : z
            .string()
            .length(9, { message: 'SSN must be 9 digits' })
            .regex(/^\d{9}$/, { message: 'SSN must be numeric' }),
    // for both login and signup
    email: z.string().email({ message: 'Invalid email address' }),
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters' }),
  });

//============== handling dwolla errors ==========
type DwollaErrorCode =
  | 'InvalidAccessToken'
  | 'ValidationError'
  | 'Required'
  | 'Invalid'
  | 'InvalidFormat'
  | 'Duplicate'
  | 'ReadOnly'
  | 'NotAllowed'
  | 'Restricted'
  | 'InsufficientFunds'
  | 'RequiresFundingSource'
  | 'FileTooLarge';

interface DwollaValidationError {
  code: DwollaErrorCode;
  message: string;
  path?: string;
}

interface DwollaErrorResponse {
  code: DwollaErrorCode;
  message: string;
  _embedded?: { errors: DwollaValidationError[] };
}

export function handleDwollaError(error: unknown) {
  // Check if the error is an instance of Error
  if (error instanceof Error) {
    const errorResponse = JSON.parse(error.message);
    // Extract properties, using optional chaining to handle any undefined cases
    const { code, message, _embedded } = errorResponse as DwollaErrorResponse;
    if (_embedded?.errors?.length) {
      console.error(`- ${code} : ${message}`);
      _embedded.errors.forEach(({ path, code, message }) =>
        console.error(`- ${code} ${path ? `Field (${path})` : ''}: ${message}`),
      );
    } else {
      // Default error logging for non-validation errors
      console.log('General Error:\n');

      console.error(parseStringify(message));
    }
  } else {
    console.error(error);
  }
}

export function handleAppError(error: unknown) {
  // Check if the error is an instance of Error
  if (error instanceof Error) {
    console.log('=============================');

    const errorResponse = JSON.parse(error.message);
    // Extract properties, using optional chaining to handle any undefined cases
    const { code, message, _embedded } = errorResponse as DwollaErrorResponse;
    if (_embedded?.errors?.length) {
      console.error(`- ${code} : ${message}`);
      _embedded.errors.forEach(({ path, code, message }) =>
        console.error(`- ${code} ${path ? `Field (${path})` : ''}: ${message}`),
      );
    } else {
      // Default error logging for non-validation errors
      console.log('General Error:\n');

      // console.error(parseStringify(message));
    }
  } else {
    console.error(error);
  }

  console.log('=============================');
}

// all input types
export type HTMLInputTypes =
  | 'text'
  | 'password'
  | 'email'
  | 'url'
  | 'tel'
  | 'number'
  | 'range'
  | 'date'
  | 'month'
  | 'week'
  | 'time'
  | 'datetime-local'
  | 'search'
  | 'color'
  | 'file'
  | 'checkbox'
  | 'radio'
  | 'button'
  | 'submit'
  | 'reset'
  | 'image'
  | 'hidden';

/**
 * Takes a date string in the format 'MM/DD/YYYY' and returns it in
 * 'YYYY-MM-DD' format.
 *
 * @param {string} inputDate - The date string in 'MM/DD/YYYY' format.
 * @returns {string} - The date string in 'YYYY-MM-DD' format.
 */
export const formatDate = (inputDate: string): string => {
  // Parse the date assuming it's in 'MM/DD/YYYY' format
  const [month, day, year] = inputDate.split('/');

  // Reformat to 'YYYY-MM-DD'
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
};
