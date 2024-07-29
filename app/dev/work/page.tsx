"use client";
import { useState } from 'react';
import { usePageMetadata } from "@/hooks/usepagemetadata"; 

export default function WorkPage() {
  const workExperiences = [
    {
      title: 'Singletrack',
      role: 'Software Engineer',
      description: 'Ruby on Rails intern with expertise in developing REST API-integrated applications for Salesforce. Contributed to design, implementation, and maintenance of key features, ensuring robust performance. Collaborated with the team to meet project objectives. Experienced in full-stack development and troubleshooting.',
      skills: ['Ruby', 'Ruby on Rails', 'Web Engineering', 'Software Industry'],
      achievements: [
        'Specialized in integrating REST APIs with Salesforce, enhancing the application\'s functionality and connectivity.',
        'Ensured smooth data exchange between the Rails application and Salesforce, optimizing overall system performance.',
        'Worked collaboratively with a welcoming and friendly team to meet project objectives and deadlines.',
        'Applied engineering principles, including TDD, to contribute to the design and development of software solutions.',
      ],
    },
    // Add more work experiences here
    // {
    //   title: 'Company Name',
    //   role: 'Role',
    //   description: 'Description of the role and responsibilities.',
    //   skills: ['Skill 1', 'Skill 2', 'Skill 3'],
    //   achievements: [
    //     'Achievement 1',
    //     'Achievement 2',
    //     'Achievement 3',
    //   ],
    // }
  ];

  usePageMetadata({
    title: 'Work',
    description: 'A collection of my work experiences and achievements.',
  });

  return (
    <section>
      <h1 className="font-medium text-2xl mb-8 tracking-tighter">my work</h1>
      <div className="prose prose-neutral dark:prose-invert">
        {workExperiences.map((experience, index) => (
          <div key={index}>
            <h2 className="font-medium text-xl mb-1 tracking-tighter">{experience.title}</h2>
            <p className="text-neutral-600 dark:text-neutral-400 text-sm">{experience.role}</p>
            <p>{experience.description}</p>
            <ul className='flex flex-row space-x-9 decoration-none'>
              {experience.skills.map((skill, sIndex) => (
                <li key={sIndex}>{skill}</li>
              ))}
            </ul>
            <ul>
              {experience.achievements.map((achievement, aIndex) => (
                <li key={aIndex}>{achievement}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}