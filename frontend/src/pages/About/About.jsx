import "./About.css"; // Import the CSS file for styling

const About = () => {
  const teamMembers = [
    {
      name: "John Doe",
      role: "Designer",
      image:
        "https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg?auto=compress&cs=tinysrgb&w=600",
      bio: "John is a creative designer with a passion for aesthetics.",
    },
    {
      name: "Jane Smith",
      role: "Developer",
      image:
        "https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      bio: "Jane is a skilled developer who brings ideas to life.",
    },
    {
      name: "Emily Johnson",
      role: "Project Manager",
      image:
        "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      bio: "Emily ensures everything runs smoothly and on time.",
    },
  ];

  return (
    <div className="about-container">
      <h1 className="about-title">About Us</h1>
      <p className="about-intro">
        Welcome to our creative space! We are a team of passionate individuals
        dedicated to delivering exceptional results.
      </p>

      <h2 className="about-subtitle">Our Mission</h2>
      <p className="about-mission">
        Our mission is to create impactful solutions that enhance user
        experiences and drive innovation.
      </p>

      <h2 className="about-subtitle">Meet the Team</h2>
      <div className="team-grid">
        {teamMembers.map((member, index) => (
          <div key={index} className="team-member">
            <img src={member.image} alt={member.name} className="team-image" />
            <h3 className="member-name">{member.name}</h3>
            <p className="member-role">{member.role}</p>
            <p className="member-bio">{member.bio}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default About;
