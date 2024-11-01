import { useState } from "react";
import PropTypes from "prop-types";
import Input from "../Input/Input";
import Textarea from "../Textarea/Textarea";
import Button from "../Button/Button";
import "./WorkForm.css";

const WorkForm = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: null,
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Titlul este obligatoriu";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Descrierea este obligatorie";
    }

    if (!formData.image) {
      newErrors.image = "Imaginea este obligatorie";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="work-form">
      <Input
        type="text"
        name="title"
        value={formData.title}
        onChange={handleChange}
        label="Titlu Artwork"
        placeholder="Introduceți titlul"
        required
        error={errors.title}
        disabled={isLoading}
      />

      <Textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        label="Descriere Artwork"
        placeholder="Descrieți artwork-ul"
        required
        error={errors.description}
        disabled={isLoading}
        rows={4}
        maxLength={500}
      />

      <Input
        type="file"
        name="image"
        onChange={handleChange}
        label="Imagine Artwork"
        accept="image/*"
        required
        error={errors.image}
        disabled={isLoading}
      />

      <Button
        type="submit"
        variant="primary"
        size="large"
        isLoading={isLoading}
        disabled={isLoading}
        fullWidth
      >
        {isLoading ? "Se încarcă..." : "Adaugă Artwork"}
      </Button>
    </form>
  );
};

WorkForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
};

export default WorkForm;
