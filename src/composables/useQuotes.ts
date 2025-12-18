import { ref, computed } from 'vue'
import { techQuotes, type TechQuote } from '../data/techQuotes'

const DEFAULT_QUOTE: TechQuote = {
  text: 'The only way to do great work is to love what you do.',
  author: 'Steve Jobs',
  category: 'general',
}

export function useQuotes() {
  const currentQuote = ref<TechQuote>(DEFAULT_QUOTE)

  /**
   * Select a random quote from the collection
   */
  function selectRandomQuote(): TechQuote {
    // Validate quote collection
    if (!techQuotes || techQuotes.length === 0) {
      console.warn('No quotes available, using default')
      return DEFAULT_QUOTE
    }

    // Validate each quote has required fields
    const validQuotes = techQuotes.filter(
      quote => quote.text && quote.text.trim().length > 0
        && quote.author && quote.author.trim().length > 0,
    )

    if (validQuotes.length === 0) {
      console.warn('No valid quotes found, using default')
      return DEFAULT_QUOTE
    }

    // Select random quote
    const randomIndex = Math.floor(Math.random() * validQuotes.length)
    return validQuotes[randomIndex]
  }

  /**
   * Get a new random quote
   */
  function getNewQuote() {
    currentQuote.value = selectRandomQuote()
  }

  /**
   * Filter quotes by category
   */
  function getQuotesByCategory(category: TechQuote['category']) {
    return techQuotes.filter(quote => quote.category === category)
  }

  // Initialize with a random quote
  currentQuote.value = selectRandomQuote()

  return {
    currentQuote: computed(() => currentQuote.value),
    getNewQuote,
    getQuotesByCategory,
    selectRandomQuote,
  }
}
