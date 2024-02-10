import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { suggestions } from './data';
import { useSyncState } from './useSyncState';

export const Suggestions = () => {
  const [index, setIndex] = useState(0);
  const [isOff, setIsOff] = useState(false);

  useEffect(() => {
    if (!isOff) {
      const incIndex = () => setIndex((i) => (i + 1) % suggestions.length);
      const id = setInterval(incIndex, 5000);
      return () => clearInterval(id);
    }
  }, [isOff]);

  useSyncState('suggestionsOff', isOff, setIsOff);

  // SIMPLEST APPROACH
  //   const navigate = useNavigate();
  //   useEffect(() => {
  //     if (isOff) navigate(`?suggestionsOff=${isOff}`, { replace: true });
  //     else navigate('');
  //   }, [isOff]);

  // REFINED APPROACH
  //   const navigate = useNavigate();
  //   useEffect(() => {
  //     if (isOff) {
  //       const params = new URLSearchParams(window.location.search);
  //       params.set('suggestionsOff', `${isOff}`);
  //       navigate(`?${params.toString()}`, {
  //         replace: true,
  //       });
  //     } else {
  //       const params = new URLSearchParams(window.location.search);
  //       params.delete('suggestionsOff');
  //       navigate(`?${params.toString()}`, {
  //         replace: true,
  //       });
  //     }
  //   }, [isOff]);

  return (
    <div>
      {isOff && <button onClick={() => setIsOff(false)}>Show suggestions</button>}

      {!isOff && (
        <div>
          <h3>
            Suggestions for you <button onClick={() => setIsOff(true)}>off</button>
          </h3>

          <h4>{suggestions[index].name}</h4>
          <p>{suggestions[index].description}</p>
        </div>
      )}
    </div>
  );
};

// REFINED APPROACH
// const navigate = useNavigate();
// useEffect(() => {
//   if (isOff) {
//     const params = new URLSearchParams(window.location.search);
//     params.set('suggestionsOff', `${isOff}`);
//     navigate(`?${params.toString()}`, {
//       replace: true,
//     });
//   } else {
//     const params = new URLSearchParams(window.location.search);
//     params.delete('suggestionsOff');
//     navigate(`?${params.toString()}`, {
//       replace: true,
//     });
//   }
// }, [isOff]);

// EXPERIMENTS

//   useEffect(() => {
//     if (isOff)
//       history.replaceState(null,"",location.pathname + `?suggestionsOff=${isOff}`);
//     else history.replaceState(null, "", location.pathname);
//   }, [isOff]);

//   const navigate = useNavigate();
//   useEffect(() => {
//     if (isOff)
//       navigate(`?suggestionsOff=${isOff}`, { replace: true });
//     else navigate("");
//   }, [isOff]);
