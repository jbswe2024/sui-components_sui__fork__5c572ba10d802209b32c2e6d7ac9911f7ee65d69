// create optimizelyInstance with id 'optimizely'
// create optimizelyInstance with id 'houston' (will need houston datafile url)
// we should try to abstract all the methods as there all do the same
// for backwards compability we'll need to set a fixed name to the first adapter in order
// to use it as default identifier when nothing is passed by

import OptimizelyAdapter from './optimizely.js'

class MultipleOptimizelyAdapter {
  static createMultipleOptimizelyInstances(...optionsByInstance) {
    return optionsByInstance.map(({datafile, sdkKey, ...restOptions}) => {
      if (
        !datafile &&
        typeof window !== 'undefined' &&
        window.__INITIAL_CONTEXT_VALUE__?.pde[sdkKey]
      ) {
        datafile = window.__INITIAL_CONTEXT_VALUE__.pde[sdkKey]
        sdkKey = undefined
      }
      return OptimizelyAdapter.createOptimizelyInstance({
        datafile,
        sdkKey,
        ...restOptions
      })
    })
  }

  #adapters = []

  #getAdapterById({adapterId}) {
    return this.#adapters.find(adapter => adapter.getId() === adapterId)
  }

  constructor(...optimizelyAdapters) {
    this.#adapters = optimizelyAdapters
  }

  getInitialData() {
    const initialData = {}

    this.#adapters.forEach(adapter => {
      initialData[adapter.getSdkKey()] = adapter.getInitialData()
    })

    return initialData
  }

  onReady() {
    return Promise.all(this.#adapters.map(adapter => adapter.onReady()))
  }

  getEnabledFeatures({adapterId = 'default', ...props}) {
    const adapter = this.#getAdapterById({adapterId})
    return adapter.getEnabledFeatures({...props})
  }

  getOptimizelyConfig({adapterId = 'default', ...props}) {
    const adapter = this.#getAdapterById({adapterId})
    return adapter.getOptimizelyConfig({...props})
  }

  activateExperiment({adapterId = 'default', ...props}) {
    const adapter = this.#getAdapterById({adapterId})
    return adapter.activateExperiment({...props})
  }

  getVariation({adapterId = 'default', ...props}) {
    const adapter = this.#getAdapterById({adapterId})
    return adapter.getVariation({...props})
  }

  isFeatureEnabled({adapterId = 'default', ...props}) {
    const adapter = this.#getAdapterById({adapterId})
    return adapter.isFeatureEnabled({...props})
  }

  getAllFeatureVariables({adapterId = 'default', ...props}) {
    const adapter = this.#getAdapterById({adapterId})
    return adapter.getAllFeatureVariables({...props})
  }

  updateConsents({adapterId = 'default', ...props}) {
    const adapter = this.#getAdapterById({adapterId})
    return adapter.updateConsents({...props})
  }
}

export default MultipleOptimizelyAdapter
