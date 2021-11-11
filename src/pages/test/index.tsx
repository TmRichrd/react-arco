import React, { useEffect } from 'react';

export default () => {
  useEffect(() => {
    document.body.setAttribute('arco-theme', 'light');
  }, []);
  return (
    <div>
      <div>1</div>
    </div>
  );
};
