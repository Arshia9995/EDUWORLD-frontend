import React from "react";

const testimonials: { name: string; feedback: string; title: string }[] = [
  { name: "John Doe", feedback: "EduWorld helped me learn web development from scratch. The instructors are amazing!", title: "Web Developer" },
  { name: "Jane Smith", feedback: "The courses are well-structured, and I was able to complete the data science course with ease.", title: "Data Scientist" }
];

const Testimonials: React.FC = () => {
  return (
    <section id="testimonials" className="py-16 bg-gray-200">
      <div className="container mx-auto text-center">
        <h3 className="text-3xl font-semibold mb-8">What Our Students Say</h3>
        <div className="flex flex-wrap justify-center gap-6">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md w-64">
              <p>"{testimonial.feedback}"</p>
              <h5 className="font-semibold mt-4">{testimonial.name}</h5>
              <p>{testimonial.title}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
