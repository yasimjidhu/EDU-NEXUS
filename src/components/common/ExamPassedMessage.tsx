import React, { useState } from 'react';
import { usePopper } from 'react-popper';

const ExamPassedMessage = () => {
  const [show, setShow] = useState(false);
  const [referenceElement, setReferenceElement] = useState(null);
  const [popperElement, setPopperElement] = useState(null);
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: 'top',
  });

  const handleShowMessage = () => {
    setShow(true);
    setTimeout(() => {
      setShow(false);
    }, 3000); // hide after 3 seconds
  };

  return (
    <div>
      <button
        ref={setReferenceElement}
        onClick={handleShowMessage}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Show Result
      </button>
      {show && (
        <div
          ref={setPopperElement}
          style={styles.popper}
          {...attributes.popper}
          className="bg-green-500 text-white p-2 rounded shadow-lg"
        >
          You Passed!
        </div>
      )}
    </div>
  );
};

export default ExamPassedMessage;