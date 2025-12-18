export interface ResumeItem {
  title: string
  subtitle?: string
  period?: string
  description?: string
  tags?: string[]
  highlights?: string[]
}

export interface ResumeData {
  personal: {
    name: string
    title: string
    email: string
    location: string
    links: { platform: string, url: string }[]
  }
  summary: string
  experience: ResumeItem[]
  education: ResumeItem[]
  skills: {
    category: string
    items: string[]
  }[]
  projects: ResumeItem[]
}

export const resumeData: ResumeData = {
  personal: {
    name: 'Your Name',
    title: 'Full Stack Developer & Blockchain Enthusiast',
    email: 'your.email@example.com',
    location: 'Your City, Country',
    links: [
      { platform: 'GitHub', url: 'https://github.com/yourusername' },
      { platform: 'Twitter', url: 'https://twitter.com/yourusername' },
      { platform: 'LinkedIn', url: 'https://linkedin.com/in/yourusername' },
    ],
  },
  summary: 'Passionate developer with expertise in modern web technologies and blockchain development. Focused on building scalable, user-centric applications with clean code and innovative solutions.',
  experience: [
    {
      title: 'Senior Full Stack Developer',
      subtitle: 'Tech Company Inc.',
      period: '2022 - Present',
      description: 'Leading development of web3 applications and decentralized platforms.',
      highlights: [
        'Built scalable microservices architecture serving 100K+ users',
        'Implemented smart contracts for DeFi applications',
        'Mentored junior developers and conducted code reviews',
      ],
      tags: ['Vue.js', 'TypeScript', 'Solidity', 'Node.js', 'PostgreSQL'],
    },
    {
      title: 'Full Stack Developer',
      subtitle: 'Startup XYZ',
      period: '2020 - 2022',
      description: 'Developed and maintained multiple web applications and APIs.',
      highlights: [
        'Created responsive web applications using Vue.js and React',
        'Designed and implemented RESTful APIs',
        'Improved application performance by 40%',
      ],
      tags: ['React', 'Vue.js', 'Express.js', 'MongoDB', 'AWS'],
    },
    {
      title: 'Junior Developer',
      subtitle: 'Digital Agency',
      period: '2018 - 2020',
      description: 'Contributed to various client projects and internal tools.',
      highlights: [
        'Developed responsive websites for clients',
        'Collaborated with designers to implement UI/UX',
        'Maintained and updated existing codebases',
      ],
      tags: ['JavaScript', 'HTML/CSS', 'PHP', 'MySQL'],
    },
  ],
  education: [
    {
      title: 'Bachelor of Science in Computer Science',
      subtitle: 'University Name',
      period: '2014 - 2018',
      description: 'Focused on software engineering and algorithms.',
      highlights: [
        'GPA: 3.8/4.0',
        'Dean\'s List for 6 semesters',
        'Capstone project: Blockchain-based voting system',
      ],
    },
  ],
  skills: [
    {
      category: 'Frontend',
      items: ['Vue.js', 'React', 'TypeScript', 'Tailwind CSS', 'UnoCSS', 'Vite'],
    },
    {
      category: 'Backend',
      items: ['Node.js', 'Express', 'NestJS', 'Python', 'FastAPI', 'GraphQL'],
    },
    {
      category: 'Blockchain',
      items: ['Solidity', 'Ethers.js', 'Web3.js', 'Hardhat', 'Smart Contracts'],
    },
    {
      category: 'Database',
      items: ['PostgreSQL', 'MongoDB', 'Redis', 'MySQL'],
    },
    {
      category: 'DevOps',
      items: ['Docker', 'AWS', 'CI/CD', 'GitHub Actions', 'Vercel'],
    },
    {
      category: 'Tools',
      items: ['Git', 'VS Code', 'Figma', 'Postman', 'Linux'],
    },
  ],
  projects: [
    {
      title: 'DeFi Dashboard',
      period: '2023',
      description: 'A comprehensive dashboard for tracking DeFi investments across multiple chains.',
      tags: ['Vue.js', 'TypeScript', 'Ethers.js', 'TailwindCSS'],
      highlights: [
        'Real-time portfolio tracking',
        'Multi-chain support (Ethereum, BSC, Polygon)',
        'Integration with major DeFi protocols',
      ],
    },
    {
      title: 'NFT Marketplace',
      period: '2022',
      description: 'Decentralized marketplace for buying and selling NFTs.',
      tags: ['React', 'Solidity', 'IPFS', 'Hardhat'],
      highlights: [
        'Smart contract development and testing',
        'IPFS integration for metadata storage',
        'Wallet connection with MetaMask',
      ],
    },
    {
      title: 'Personal Blog Platform',
      period: '2023',
      description: 'Modern blog platform with markdown support and dark mode.',
      tags: ['Vue.js', 'Vite', 'UnoCSS', 'TypeScript'],
      highlights: [
        'Static site generation',
        'Responsive design',
        'SEO optimized',
      ],
    },
  ],
}
