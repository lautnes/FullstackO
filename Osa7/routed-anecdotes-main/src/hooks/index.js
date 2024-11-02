import { useState } from 'react';

export const useField = (type) => {
  const [value, setValue] = useState('');

  const onChange = (event) => {
    setValue(event.target.value);
  };

  const reset = () => {
    setValue('');
  };

  // Return an object with inputProps for spreading and reset separately
  return {
    inputProps: {
      type,
      value,
      onChange
    },
    reset
  };
};
