const Statistics = ({ good, neutral, bad }) => {
    const total = good + neutral + bad;
    const average = total === 0 ? 0 : (good - bad) / total;
    const positivePercentage = total === 0 ? 0 : (good / total) * 100;
  
    if (total === 0) {
      return <p>No feedback given</p>;
    }
  
    return (
      <div>
        <p>Good: {good}</p>
        <p>Neutral: {neutral}</p>
        <p>Bad: {bad}</p>
        <p>All: {total}</p>
        <p>Average: {average.toFixed(2)}</p>
        <p>Positive: {positivePercentage.toFixed(2)} %</p>
      </div>
    );
  };
  
  export default Statistics;
  