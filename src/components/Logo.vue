<template>
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <title>AimerFeng @ aimerfeng.me</title>
    <!-- Outer hexagon representing blockchain -->
    <path
      class="hexagon"
      d="M50 10 L80 27.5 L80 62.5 L50 80 L20 62.5 L20 27.5 Z"
      stroke-width="2.5"
      stroke-linecap="round"
      stroke-linejoin="round"
      fill="none"
    />
    <!-- Inner "A" for AimerFeng -->
    <path
      class="letter-a"
      d="M50 30 L35 65 M50 30 L65 65 M40 55 L60 55"
      stroke-width="3"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <!-- Small dots representing AI/data nodes -->
    <circle class="dot dot1" cx="50" cy="25" r="2" />
    <circle class="dot dot2" cx="73" cy="37" r="2" />
    <circle class="dot dot3" cx="73" cy="53" r="2" />
    <circle class="dot dot4" cx="50" cy="75" r="2" />
    <circle class="dot dot5" cx="27" cy="53" r="2" />
    <circle class="dot dot6" cx="27" cy="37" r="2" />
  </svg>
</template>

<style scoped>
@media (prefers-reduced-motion) {
  .hexagon,
  .letter-a,
  .dot {
    animation: none !important;
    stroke-dasharray: unset !important;
  }
}

@media print {
  .hexagon,
  .letter-a,
  .dot {
    animation: none !important;
    stroke-dasharray: unset !important;
  }
}

/* Hexagon animation */
@keyframes draw-hexagon {
  0% {
    stroke-dashoffset: 1px;
    stroke-dasharray: 0 300px;
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  50% {
    stroke-dasharray: 300px 0;
  }
  100% {
    stroke-dasharray: 300px 0;
  }
}

/* Letter A animation */
@keyframes draw-letter {
  0% {
    stroke-dashoffset: 1px;
    stroke-dasharray: 0 200px;
    opacity: 0;
  }
  30% {
    opacity: 0;
  }
  40% {
    opacity: 1;
  }
  70% {
    stroke-dasharray: 200px 0;
  }
  100% {
    stroke-dasharray: 200px 0;
  }
}

/* Dot pulse animation */
@keyframes pulse {
  0%, 100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.5);
  }
}

.hexagon {
  stroke-dashoffset: 1px;
  stroke-dasharray: 300px 0;
  animation: draw-hexagon 3s ease forwards infinite;
  stroke: #303030;
}

.letter-a {
  stroke-dashoffset: 1px;
  stroke-dasharray: 200px 0;
  animation: draw-letter 3s ease forwards infinite;
  stroke: #303030;
}

.dot {
  fill: #303030;
  animation: pulse 2s ease-in-out infinite;
}

.dot1 { animation-delay: 0s; }
.dot2 { animation-delay: 0.2s; }
.dot3 { animation-delay: 0.4s; }
.dot4 { animation-delay: 0.6s; }
.dot5 { animation-delay: 0.8s; }
.dot6 { animation-delay: 1s; }

/* Dark mode */
.dark .hexagon,
.dark .letter-a {
  stroke: #fdfdfd;
}

.dark .dot {
  fill: #fdfdfd;
}
</style>
