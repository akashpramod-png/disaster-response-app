import React, { useState } from 'react';

export default function DisasterForm() {
  const [form, setForm] = useState({
    title: '', location_name: '', description: '', tags: ''
  });

  const handleChange = (e) => {
    setForm({...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch("http://localhost:5000/disasters", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({...form, tags: form.tags.split(",")}),
    });
    setForm({ title: '', location_name: '', description: '', tags: '' });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="title" placeholder="Title" onChange={handleChange} value={form.title} />
      <input name="location_name" placeholder="Location" onChange={handleChange} value={form.location_name} />
      <textarea name="description" placeholder="Description" onChange={handleChange} value={form.description} />
      <input name="tags" placeholder="Tags (comma-separated)" onChange={handleChange} value={form.tags} />
      <button type="submit">Submit Disaster</button>
    </form>
  );
}
