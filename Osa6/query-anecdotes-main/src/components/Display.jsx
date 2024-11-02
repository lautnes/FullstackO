import { useCounterValue } from '../context/CounterContext';

const Display = () => {
  const counter = useCounterValue();
  return <div className="counter-display">Counter: {counter}</div>;
};

export default Display;
