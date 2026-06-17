/**
 * Purpose: React Error Boundary — catches runtime JS errors in the component tree
 * and shows the ServerError page instead of a blank screen.
 */
import React from 'react';
import ServerError from '../pages/ServerError';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // Log to console — swap for a real error service (Sentry, etc.) if needed
    console.error('[ErrorBoundary]', error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    // Navigate to home
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return <ServerError error={this.state.error} onReset={this.handleReset} />;
    }
    return this.props.children;
  }
}
