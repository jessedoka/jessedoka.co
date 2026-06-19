"use client";
import { usePageMetadata } from "@/hooks/usepagemetadata";
import type { ReactNode } from "react";
import { useMemo } from "react";
import {
	SiRuby,
	SiRubyonrails,
	SiPostgresql,
	SiSalesforce,
	SiJavascript,
	SiPython,
} from "react-icons/si";
import { FaAws } from "react-icons/fa";

interface WorkExperience {
	title: string;
	role: string;
	description: string;
	currentlyWorking: boolean;
	skills: ReactNode[];
	achievements: string[];
}

export default function WorkPage() {
	const workExperiences: WorkExperience[] = [
		{
			title: 'Singletrack',
			role: 'Software Engineer · previously Software Engineer Intern',
			description: 'Working as a full-time engineer after a Ruby on Rails \
			internship integrating REST APIs with Salesforce. Now ship production \
			code across a large Salesforce platform (Apex, LWC/Aura), Ruby services and Python on AWS alongside CI/CD, \
			auth and security work. Trusted with production hotfixes and front-line \
			delivery for global capital-markets clients.',
			currentlyWorking: true,
			skills: useMemo(() => [
				<SiJavascript key="typescript" className="size-6" />,
				<SiSalesforce key="salesforce" className="size-6" />,
				<SiRubyonrails key="rubyOnRails" className="size-6" />,
				<SiRuby key="ruby" className="size-6" />,
				<SiPython key="python" className="size-6" />,
				<SiPostgresql key="postgresql" className="size-6" />,
				<FaAws key="aws" className="size-6" />
			], []),
			achievements: [
				"Working with Apex, JavaScript (LWC/Aura), Ruby, Python and TypeScript in a large Salesforce codebase, with production changes on AWS (Lambda, CDK).",
				"Worked on major TinyMCE editor upgrade and a Visualforce → Lightning modernisation, then owned its client-facing maintenance thereafter.",
				"Built REST API integrations between a Rails application and Salesforce, applying TDD work that began during my internship and carried into the full-time role.",
			],
		}
		// Add more work experiences here
		// {
		//   title: 'Company Name',
		//   role: 'Role',
		//   currentlyWorking: bool
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
		<section className="prose dark:prose-invert max-w-none mx-auto px-4 lg:px-0">
			<h1 className="font-medium text-2xl mb-8 tracking-tighter">my work</h1>
			<div className="prose dark:prose-invert">
				{workExperiences.map((experience, index) => (
					<div key={index}>
						<h2 className="font-medium text-xl mb-1 tracking-tighter">{experience.title}</h2>
						<p className="text-neutral-600 dark:text-neutral-400 text-sm">{experience.role}</p>
						<p>{experience.description}</p>
						<div className='w-full flex flex-wrap flex-row justify-center p-4 border border-neutral-800 rounded-md bg-white/10 dark:bg-black/10 mb-12 gap-6'>
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