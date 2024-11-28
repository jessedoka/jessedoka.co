"use client";
import { usePageMetadata } from "@/hooks/usepagemetadata"; 
import { useMemo } from "react";
import { SiRuby, SiRubyonrails, SiTypescript, SiPostgresql} from "react-icons/si";

export default function WorkPage() {
  const workExperiences = [
    {
      title: 'Singletrack',
      role: 'Software Engineer Intern',
      description: 'Ruby on Rails intern with expertise in developing REST API-integrated applications for Salesforce. Contributed to design, implementation, and maintenance of key features, ensuring robust performance. Collaborated with the team to meet project objectives. Experienced in full-stack development and troubleshooting.',
      skills: useMemo(() => [
        <SiRuby key="ruby" className="size-6" />,
        <SiRubyonrails key="rails" className="size-6" />,
        <SiTypescript key="typescript" className="size-6" />,
        <SiPostgresql key="postgresql" className="size-6" />
      ], []),
      achievements: [
        'Specialised in integrating REST APIs with Salesforce, enhancing the application\'s functionality and connectivity.',
        'Ensured smooth data exchange between the Rails application and Salesforce, optimising overall system performance.',
        'Worked collaboratively with a welcoming and friendly team to meet project objectives.',
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
            <div className='w-full flex flex-wrap flex-row justify-center p-4 border border-neutral-800 rounded-md bg-white/10 dark:bg-black/10 mb-12 space-x-6'>
              {experience.skills.map((skill, sIndex) => (
                <div key={sIndex}>{skill}</div>
              ))}
            </div>
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