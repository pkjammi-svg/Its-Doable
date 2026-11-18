export interface QuizOption {
  text: string
  correct: boolean
}

export interface Lesson {
  id: string
  title: string
  emoji: string
  estimatedMinutes: number
  content: string // markdown-ish plain text, paragraphs separated by \n\n
  hasCalculator?: boolean
  quiz: {
    question: string
    options: QuizOption[]
  }
}

export const LESSONS: Lesson[] = [
  {
    id: 'what-is-a-budget',
    title: 'What is a budget?',
    emoji: '📋',
    estimatedMinutes: 3,
    content: `A budget is a plan for your money. It tells you how much comes in and how much goes out.

Money coming in is called income. Money going out is called expenses. When expenses are less than income, you have money left over. That leftover is called a surplus.

A budget helps you make choices. Without one, money disappears and you are not sure where it went. With one, you decide where it goes.

You do not need to be rich to budget. You need to budget to understand where you stand. Even ₹100 tracked is better than ₹1,000 forgotten.

A good budget is realistic. It reflects your real life — not an ideal version of it. Start with what you actually spend, then decide what to change.`,
    quiz: {
      question: 'What does a budget help you do?',
      options: [
        { text: 'Decide where your money goes', correct: true },
        { text: 'Make more money automatically', correct: false },
        { text: 'Avoid paying taxes', correct: false },
      ],
    },
  },
  {
    id: 'needs-vs-wants',
    title: 'Needs vs wants',
    emoji: '🛒',
    estimatedMinutes: 3,
    content: `A need is something you must have to live and function. Food, shelter, clothing, and medicine are needs.

A want is something you would like but can survive without. A new phone, eating out, or a new pair of sneakers are usually wants.

The line between needs and wants can be blurry. Transport to work is a need. An expensive taxi every day when a bus works is partly a want.

Knowing the difference helps you cut spending when money is tight. You protect your needs first. Wants come after.

This is not about never enjoying life. It is about knowing which spending is flexible and which is not. That knowledge gives you control.`,
    quiz: {
      question: 'Which of these is most likely a need?',
      options: [
        { text: 'A new video game', correct: false },
        { text: 'Groceries for the week', correct: true },
        { text: 'A cinema ticket', correct: false },
      ],
    },
  },
  {
    id: 'emergency-money',
    title: 'Emergency money',
    emoji: '🛡️',
    estimatedMinutes: 3,
    content: `An emergency fund is money you set aside for unexpected events. A medical bill, a broken phone, or losing income for a month — these are emergencies.

The usual advice is to save three to six months of your expenses. That means if you spend ₹20,000 a month, your goal is ₹60,000 to ₹1,20,000 set aside.

That sounds like a lot. Start small. Even ₹1,000 is a beginning. Build it slowly.

Keep your emergency fund somewhere easy to reach — a simple savings account works. You are not trying to grow this money. You are trying to keep it safe and ready.

Do not dip into it for wants. It is only for real emergencies. Once you use it, refill it as soon as you can.`,
    quiz: {
      question: 'How much should an emergency fund ideally cover?',
      options: [
        { text: '1 week of expenses', correct: false },
        { text: '3 to 6 months of expenses', correct: true },
        { text: '10 years of expenses', correct: false },
      ],
    },
  },
  {
    id: 'saving-vs-investing',
    title: 'Saving vs investing',
    emoji: '🌱',
    estimatedMinutes: 4,
    content: `Saving means putting money aside and keeping it safe. A bank savings account is saving. The goal is to protect what you have.

Investing means putting money into something with the hope it will grow over time. Investing carries risk. You might end up with more — or less — than you put in.

Saving is for short-term goals or emergencies. Investing is for long-term goals, like retirement or a big purchase many years away.

Do not invest money you need in the next one to three years. If the market drops, you would need to sell at a loss.

A simple rule: save first (emergency fund), then invest what you can afford to leave untouched for years.`,
    quiz: {
      question: 'What is the main difference between saving and investing?',
      options: [
        { text: 'Saving is only for the rich', correct: false },
        { text: 'Investing has risk; saving keeps money safe', correct: true },
        { text: 'They are exactly the same thing', correct: false },
      ],
    },
  },
  {
    id: 'compound-growth',
    title: 'Compound growth',
    emoji: '📈',
    estimatedMinutes: 5,
    content: `Compound growth means your money earns returns, and then those returns earn more returns.

Imagine you invest ₹1,000. It earns 10% in a year — now you have ₹1,100. Next year, that ₹1,100 earns 10% — not just the original ₹1,000. You get ₹110 instead of ₹100. The extra ₹10 is compounding at work.

This sounds small at first. Over 20 or 30 years, it becomes remarkable. Time is the most important ingredient.

Starting early beats starting with more money. ₹500 a month for 30 years usually beats ₹1,000 a month for 15 years — because time compounds more than amount.

The calculator below lets you explore this. Play with the numbers. Notice how the years column makes the biggest difference.`,
    hasCalculator: true,
    quiz: {
      question: 'What makes compound growth so powerful?',
      options: [
        { text: 'It only works for large amounts', correct: false },
        { text: 'Returns earn more returns over time', correct: true },
        { text: 'It eliminates all investment risk', correct: false },
      ],
    },
  },
  {
    id: 'risk-and-reward',
    title: 'Risk and reward',
    emoji: '⚖️',
    estimatedMinutes: 3,
    content: `Risk is the chance that something does not go as planned. In money, risk usually means the chance of losing some or all of what you put in.

Higher potential reward usually comes with higher risk. This is not a coincidence. If something was guaranteed to give great returns, everyone would do it. That demand would push the price up until the returns became ordinary.

A bank savings account has very low risk — but very low reward. Some investments have higher potential reward — but can also lose value.

Understanding risk means asking: can I afford to lose this? If the answer is no, choose safer options.

Risk is not always bad. Avoiding all risk means your money may not grow fast enough to outpace inflation. The goal is matching risk to your time horizon and comfort level.`,
    quiz: {
      question: 'Why do higher-risk investments usually offer higher potential rewards?',
      options: [
        { text: 'The government forces them to', correct: false },
        { text: 'If returns were guaranteed, everyone would buy until returns dropped', correct: true },
        { text: 'Lower risk always means lower taxes', correct: false },
      ],
    },
  },
  {
    id: 'diversification',
    title: 'Diversification',
    emoji: '🧺',
    estimatedMinutes: 3,
    content: `Diversification means spreading your money across different things. The old saying is: do not put all your eggs in one basket.

If you put all your money into one company and it fails, you lose everything. If you spread it across many companies, one failure hurts much less.

You can diversify across companies, industries, countries, and types of assets. Each adds a layer of protection.

Diversification does not remove risk entirely. All investments can fall at the same time — in a wide market crash, for example. But it reduces the chance that one bad event wipes you out.

Diversification is one of the few free benefits in investing. It reduces risk without necessarily reducing long-term returns.`,
    quiz: {
      question: 'What is the main benefit of diversification?',
      options: [
        { text: 'It guarantees profit', correct: false },
        { text: 'It reduces the impact of any single loss', correct: true },
        { text: 'It doubles your returns automatically', correct: false },
      ],
    },
  },
  {
    id: 'inflation',
    title: 'Inflation',
    emoji: '📉',
    estimatedMinutes: 3,
    content: `Inflation means prices rise over time. A meal that costs ₹100 today might cost ₹115 in five years.

This matters for your money. If your savings earn 3% a year but inflation is 6%, your money is effectively losing value. You can buy less with it each year.

This is why just holding cash long term is risky in its own quiet way. The numbers stay the same, but the purchasing power falls.

Investments that grow faster than inflation help protect your buying power. That is partly why long-term investing matters.

India has had periods of high inflation. It is worth checking what inflation is doing when you plan your money goals.`,
    quiz: {
      question: 'If inflation is 6% and your savings earn 3%, what happens to your buying power?',
      options: [
        { text: 'It stays the same', correct: false },
        { text: 'It grows by 3%', correct: false },
        { text: 'It shrinks — you can buy less over time', correct: true },
      ],
    },
  },
  {
    id: 'borrowing-and-interest',
    title: 'Borrowing and interest',
    emoji: '🏦',
    estimatedMinutes: 4,
    content: `When you borrow money, you pay it back plus interest. Interest is the cost of using someone else's money.

A loan with 12% interest a year means you pay ₹12 for every ₹100 borrowed, every year. EMIs (equated monthly instalments) break this into monthly payments.

Not all debt is bad. A student loan for education that leads to better income can be worth it. A home loan lets you live in a property while paying for it over time.

Bad debt is borrowing for things that lose value quickly — like using a credit card to buy things you do not need and paying high interest on the balance.

The rule of thumb: borrow only for things that last longer than the loan. Avoid high-interest debt. Pay it off as fast as you can.`,
    quiz: {
      question: 'What is interest on a loan?',
      options: [
        { text: 'A reward given by the bank', correct: false },
        { text: 'The cost you pay for borrowing money', correct: true },
        { text: 'A government tax on savings', correct: false },
      ],
    },
  },
  {
    id: 'time-vs-timing',
    title: 'Time vs timing the market',
    emoji: '⏳',
    estimatedMinutes: 4,
    content: `Timing the market means trying to buy when prices are low and sell when prices are high. It sounds smart. In practice, almost no one does it consistently — not even professional investors.

Markets are unpredictable day to day. Studies show that missing just the best few days in a year of investing dramatically lowers your returns. Those best days often come right after the worst ones.

Time in the market means staying invested for a long period, regardless of short-term ups and downs. This approach works better for most people.

Regular investing — putting in a fixed amount each month — is called rupee cost averaging. When prices are low, you buy more. When prices are high, you buy less. Over time, this smooths out the bumps.

The goal is not to outsmart the market. It is to let time and consistency do the work.`,
    quiz: {
      question: 'What does "time in the market" mean?',
      options: [
        { text: 'Buying only at the perfect moment', correct: false },
        { text: 'Staying invested long-term regardless of short-term changes', correct: true },
        { text: 'Trading every day to maximise gains', correct: false },
      ],
    },
  },
  {
    id: 'what-is-an-index',
    title: 'What is an index?',
    emoji: '📊',
    estimatedMinutes: 3,
    content: `An index is a way to measure how a group of things is performing. A market index measures a selection of companies to show how the overall market is doing.

The Sensex tracks 30 large Indian companies listed on the Bombay Stock Exchange. The Nifty 50 tracks 50 large companies on the National Stock Exchange. These numbers go up and down as those companies' values change.

When you hear "the market is up 2% today," they usually mean an index rose by 2%.

Indexes are useful as benchmarks. If your investments grew 8% but the index grew 15%, your investments underperformed the market.

This lesson covers the concept only. How exactly to invest is a conversation for a registered financial adviser or a trusted adult who knows your situation.`,
    quiz: {
      question: 'What does a market index like the Nifty 50 measure?',
      options: [
        { text: 'The government budget deficit', correct: false },
        { text: 'How a selected group of companies is performing', correct: true },
        { text: 'The total gold reserves in India', correct: false },
      ],
    },
  },
  {
    id: 'spotting-scams',
    title: 'Spotting scams',
    emoji: '🚨',
    estimatedMinutes: 4,
    content: `Financial scams target everyone — including young people. Knowing the warning signs protects you.

Red flag 1: Guaranteed high returns. No legitimate investment can guarantee high returns. If someone promises 30% a month with no risk, it is a scam.

Red flag 2: Urgency. "Act now or lose this opportunity forever." Real investments do not disappear overnight. Urgency is a pressure tactic.

Red flag 3: Referral chains. Many scams grow by paying you to bring in friends. This is often a pyramid or Ponzi scheme. It collapses when new money stops coming in.

Red flag 4: No clear explanation. If you cannot understand what the investment actually does in plain language, do not put money in it.

Red flag 5: Requests for personal details or money upfront. Never send money to unlock more money. Never share your bank password, OTP or PIN with anyone.

If something feels wrong, it probably is. It is always okay to say no and walk away.`,
    quiz: {
      question: 'Which of these is a warning sign of a scam?',
      options: [
        { text: 'The investment has a registered number', correct: false },
        { text: 'It promises guaranteed high returns with no risk', correct: true },
        { text: 'The company has a physical office', correct: false },
      ],
    },
  },
]
