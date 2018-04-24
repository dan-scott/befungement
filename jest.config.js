module.exports = {
  collectCoverageFrom: ['src/**/*.{js,jsx}'],
  coverageDirectory: 'coverage',
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
};
