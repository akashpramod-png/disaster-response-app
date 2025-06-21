import React from 'react';

export default function DisasterList({ disasters }) {
  return (
    <div>
      <h2>Disasters</h2>
      {disasters.map(d => (
        <div key={d.id}>
          <h3>{d.title}</h3>
          <p>{d.description}</p>
          <p><b>Location:</b> {d.location_name}</p>
          <p><b>Tags:</b> {d.tags.join(", ")}</p>
        </div>
      ))}
    </div>
  );
}
