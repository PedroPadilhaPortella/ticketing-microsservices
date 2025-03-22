import { useState } from 'react';
import axios from 'axios';

const useRequest = ({ url, method, body, onSuccess }) => {
  const [errors, setErrors] = useState(null);

  const call = async (extraProps = {}) => {
    try {
      setErrors(null);
      const response = await axios[method](url, { ...body, ...extraProps });

      if (onSuccess) onSuccess(response.data);

      return response.data;
    } catch (err) {
      setErrors(
        <div className="alert alert-danger mt-3">
          <ul className="my-0">
            {err.response.data.errors.map((error) => <li key={error.message}>{error.message}</li>)}
          </ul>
        </div>
      );
    }
  }

  return { call, errors };
}

export default useRequest;