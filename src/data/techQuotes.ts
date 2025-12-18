export interface TechQuote {
  text: string
  author: string
  category?: 'programming' | 'ai' | 'web3' | 'general'
}

export const techQuotes: TechQuote[] = [
  // Programming Wisdom
  {
    text: 'Talk is cheap. Show me the code.',
    author: 'Linus Torvalds',
    category: 'programming',
  },
  {
    text: 'The best way to predict the future is to invent it.',
    author: 'Alan Kay',
    category: 'programming',
  },
  {
    text: 'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    author: 'Martin Fowler',
    category: 'programming',
  },
  {
    text: 'First, solve the problem. Then, write the code.',
    author: 'John Johnson',
    category: 'programming',
  },
  {
    text: 'Code is like humor. When you have to explain it, it\'s bad.',
    author: 'Cory House',
    category: 'programming',
  },
  {
    text: 'Make it work, make it right, make it fast.',
    author: 'Kent Beck',
    category: 'programming',
  },
  {
    text: 'Simplicity is the soul of efficiency.',
    author: 'Austin Freeman',
    category: 'programming',
  },

  // AI & Machine Learning
  {
    text: 'Artificial intelligence is the new electricity.',
    author: 'Andrew Ng',
    category: 'ai',
  },
  {
    text: 'The question of whether a computer can think is no more interesting than the question of whether a submarine can swim.',
    author: 'Edsger W. Dijkstra',
    category: 'ai',
  },
  {
    text: 'Machine learning is the last invention that humanity will ever need to make.',
    author: 'Nick Bostrom',
    category: 'ai',
  },
  {
    text: 'AI is not going to replace humans, but humans with AI are going to replace humans without AI.',
    author: 'Karim Lakhani',
    category: 'ai',
  },
  {
    text: 'The development of full artificial intelligence could spell the end of the human race.',
    author: 'Stephen Hawking',
    category: 'ai',
  },

  // Web3 & Blockchain
  {
    text: 'Blockchain is the tech. Bitcoin is merely the first mainstream manifestation of its potential.',
    author: 'Marc Kenigsberg',
    category: 'web3',
  },
  {
    text: 'The blockchain does one thing: It replaces third-party trust with mathematical proof that something happened.',
    author: 'Adam Draper',
    category: 'web3',
  },
  {
    text: 'Blockchain is moving beyond cryptocurrency, and it\'s worth paying attention.',
    author: 'Satya Nadella',
    category: 'web3',
  },
  {
    text: 'Decentralization is not a technology, it\'s a philosophy.',
    author: 'Vitalik Buterin',
    category: 'web3',
  },
  {
    text: 'The root problem with conventional currency is all the trust that\'s required to make it work.',
    author: 'Satoshi Nakamoto',
    category: 'web3',
  },

  // General Tech Wisdom
  {
    text: 'The advance of technology is based on making it fit in so that you don\'t really even notice it.',
    author: 'Bill Gates',
    category: 'general',
  },
  {
    text: 'Technology is best when it brings people together.',
    author: 'Matt Mullenweg',
    category: 'general',
  },
  {
    text: 'Innovation distinguishes between a leader and a follower.',
    author: 'Steve Jobs',
    category: 'general',
  },
  {
    text: 'The only way to do great work is to love what you do.',
    author: 'Steve Jobs',
    category: 'general',
  },
  {
    text: 'Technology is nothing. What\'s important is that you have a faith in people.',
    author: 'Steve Jobs',
    category: 'general',
  },
  {
    text: 'The Internet is becoming the town square for the global village of tomorrow.',
    author: 'Bill Gates',
    category: 'general',
  },
  {
    text: 'We are stuck with technology when what we really want is just stuff that works.',
    author: 'Douglas Adams',
    category: 'general',
  },
  {
    text: 'The computer was born to solve problems that did not exist before.',
    author: 'Bill Gates',
    category: 'general',
  },
  {
    text: 'Software is a great combination between artistry and engineering.',
    author: 'Bill Gates',
    category: 'general',
  },
  {
    text: 'The best minds of my generation are thinking about how to make people click ads.',
    author: 'Jeff Hammerbacher',
    category: 'general',
  },
  {
    text: 'Move fast and break things. Unless you are breaking stuff, you are not moving fast enough.',
    author: 'Mark Zuckerberg',
    category: 'general',
  },
  {
    text: 'The function of good software is to make the complex appear to be simple.',
    author: 'Grady Booch',
    category: 'general',
  },
]
