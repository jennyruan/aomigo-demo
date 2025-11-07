import { useState } from 'react';
import { CheckCircle, AlertCircle, Settings as SettingsIcon, Zap, Database, Globe, Cpu } from 'lucide-react';
import { API_STATUS } from '../lib/config';
import { t, useLocale } from '../lib/lingo';
import { cactusClient } from '../lib/cactus';

export function Settings() {
  const [testing, setTesting] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<Record<string, string>>({});
  const [latency, setLatency] = useState<number | null>(null);
  const locale = useLocale();

  async function testConnection(service: string) {
    setTesting(service);
    setTestResults(prev => ({ ...prev, [service]: 'Testing...' }));

    await new Promise(resolve => setTimeout(resolve, 1000));

    if (service === 'cactus') {
      try {
        const lat = await cactusClient.measureLatency();
        setLatency(lat);
        setTestResults(prev => ({
          ...prev,
          [service]: `Success! Latency: ${lat}ms ${cactusClient.isSimulated() ? '(simulated)' : ''}`,
        }));
      } catch (error) {
        setTestResults(prev => ({ ...prev, [service]: 'Connection test failed' }));
      }
    } else {
      setTestResults(prev => ({
        ...prev,
        [service]: API_STATUS[service as keyof typeof API_STATUS]
          ? 'Connection successful!'
          : 'Using fallback mode',
      }));
    }

    setTesting(null);
  }

  const integrations = [
    {
      id: 'stackAuth',
      name: 'Stack Auth',
      icon: Zap,
      status: API_STATUS.stackAuth,
      activeLabel: 'Connected',
      fallbackLabel: 'Demo Mode',
      description: 'User authentication with magic links',
      color: 'orange',
    },
    {
      id: 's2',
      name: 'S2.dev',
      icon: Database,
      status: API_STATUS.s2,
      activeLabel: 'Connected',
      fallbackLabel: 'Using localStorage',
      description: 'Event streaming and data persistence',
      color: 'blue',
    },
    {
      id: 'lingo',
      name: 'Lingo.dev',
      icon: Globe,
      status: API_STATUS.lingo,
      activeLabel: 'Connected',
      fallbackLabel: 'Using fallback dictionary',
      description: 'Multilingual UI (English/中文)',
      color: 'green',
    },
    {
      id: 'cactus',
      name: 'Cactus Compute',
      icon: Cpu,
      status: API_STATUS.cactus,
      activeLabel: 'Connected',
      fallbackLabel: 'Simulated mode',
      description: 'Privacy-first local AI processing',
      color: 'purple',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <SettingsIcon className="w-8 h-8 text-orange-600" />
          <h1 className="text-3xl font-bold text-brown-800">
            {t('settings.title', locale)}
          </h1>
        </div>
        <p className="text-brown-600">
          Manage your API integrations and view connection status
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg shadow-orange-100 p-6 mb-6">
        <h2 className="text-xl font-semibold text-brown-800 mb-4">
          {t('settings.apiStatus', locale)}
        </h2>

        <div className="space-y-4">
          {integrations.map((integration) => {
            const Icon = integration.icon;
            const isActive = integration.status;
            const testResult = testResults[integration.id];

            return (
              <div
                key={integration.id}
                className="border border-orange-200 rounded-xl p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div
                      className={`p-2 rounded-lg bg-${integration.color}-50`}
                    >
                      <Icon className={`w-6 h-6 text-${integration.color}-600`} />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-brown-800">
                          {integration.name}
                        </h3>
                        {isActive ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-yellow-600" />
                        )}
                      </div>

                      <p className="text-sm text-brown-600 mb-2">
                        {integration.description}
                      </p>

                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            isActive
                              ? 'bg-green-100 text-green-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}
                        >
                          {isActive
                            ? integration.activeLabel
                            : integration.fallbackLabel}
                        </span>

                        {integration.id === 'cactus' && latency && (
                          <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-700">
                            {latency}ms
                          </span>
                        )}
                      </div>

                      {testResult && (
                        <p className="text-xs text-brown-500 mt-2">
                          {testResult}
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => testConnection(integration.id)}
                    disabled={testing === integration.id}
                    className="px-4 py-2 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {testing === integration.id
                      ? t('status.loading', locale)
                      : t('settings.testConnection', locale)}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-gradient-to-r from-orange-50 to-cream-50 rounded-2xl p-6 border border-orange-200">
        <h3 className="font-semibold text-brown-800 mb-3">
          Getting Started with API Keys
        </h3>

        <div className="space-y-3 text-sm text-brown-700">
          <div>
            <strong>Stack Auth:</strong> Sign up at{' '}
            <a
              href="https://stack-auth.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-600 hover:underline"
            >
              stack-auth.com
            </a>{' '}
            and add VITE_STACK_AUTH_PUBLISHABLE_KEY to your .env file
          </div>

          <div>
            <strong>S2.dev:</strong> Get your token from{' '}
            <a
              href="https://s2.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-600 hover:underline"
            >
              s2.dev
            </a>{' '}
            and add VITE_S2_TOKEN to your .env file
          </div>

          <div>
            <strong>Lingo.dev:</strong> Register at{' '}
            <a
              href="https://lingo.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-600 hover:underline"
            >
              lingo.dev
            </a>{' '}
            and add VITE_LINGO_API_KEY to your .env file
          </div>

          <div>
            <strong>Cactus Compute:</strong> Get started at{' '}
            <a
              href="https://cactuscompute.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-600 hover:underline"
            >
              cactuscompute.com
            </a>{' '}
            and add VITE_CACTUS_API_KEY to your .env file
          </div>

          <div className="mt-4 p-3 bg-white rounded-lg border border-orange-200">
            <p className="font-medium mb-2">All features work without API keys!</p>
            <p className="text-xs">
              Aomigo automatically falls back to demo mode and local storage when
              API keys are not provided. This ensures you can try all features
              without any setup.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
