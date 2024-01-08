import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Work',
  description: 'A summary of my work and contributions.',
};

async function Stars() {
  let res = await fetch('https://api.github.com/repos/vercel/next.js');
  let json = await res.json();
  let count = Math.round(json.stargazers_count / 1000);
  return `${count}k stars`;
}

export default function WorkPage() {
  return (
    <section>
      <h1 className="font-medium text-2xl mb-8 tracking-tighter">my work</h1>
      <div className="prose prose-neutral dark:prose-invert">
        <p>
          Dedicated to crafting products that resonate with others while ensuring they are both highly dependable and impeccably designed; an intersection of reliability and aesthetic excellence.
          Here&apos;s a brief overview of my accomplishments thus far.
        </p>
        <hr className="my-6 border-neutral-100 dark:border-neutral-800" />
        <h2 className="font-medium text-xl mb-1 tracking-tighter">Singletrack</h2>
        <p className="text-neutral-600 dark:text-neutral-400 text-sm">
          Software Engineer
        </p>
        <p>
          Ruby on Rails intern with expertise in developing REST API-integrated applications for Salesforce. Contributed to design, implementation, and maintenance of key features, ensuring robust performance. Collaborated with the team to meet project objectives. Experienced in full-stack development and troubleshooting. Skills: Ruby, Ruby on Rails, Web Engineering, Software Industry.
        </p>
        <ul>
          <li>
            Specialized in integrating REST APIs with Salesforce, enhancing the application&apos;s functionality and connectivity.
          </li>
          <li>
            Ensured smooth data exchange between the Rails application and Salesforce, optimizing overall system performance.
          </li>
          <li>
            Worked collaboratively with a welcoming and friendly team to meet project objectives and deadlines.
          </li>
          <li>
            Applied engineering principles, including TDD, to contribute to the design and development of software solutions.
          </li>
        </ul>
        
      </div>
    </section>
  );
}
