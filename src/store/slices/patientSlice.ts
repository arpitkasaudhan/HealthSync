import { createSlice, createSelector, type PayloadAction } from '@reduxjs/toolkit';
import type { Patient, PatientStatus, Department } from '@/types';
import { MOCK_PATIENTS } from '@/data/mockData';
import type { RootState } from '@/store';

type ViewMode = 'grid' | 'list';

interface PatientFilters {
  search: string;
  status: PatientStatus | 'All';
  department: Department | 'All';
}

interface PatientState {
  patients: Patient[];
  selectedPatientId: string | null;
  viewMode: ViewMode;
  filters: PatientFilters;
  loading: boolean;
}

const initialState: PatientState = {
  patients: MOCK_PATIENTS,
  selectedPatientId: null,
  viewMode: 'grid',
  loading: false,
  filters: {
    search: '',
    status: 'All',
    department: 'All',
  },
};

const patientSlice = createSlice({
  name: 'patients',
  initialState,
  reducers: {
    setViewMode(state, action: PayloadAction<ViewMode>) {
      state.viewMode = action.payload;
    },
    setSelectedPatientId(state, action: PayloadAction<string | null>) {
      state.selectedPatientId = action.payload;
    },
    setFilter<K extends keyof PatientFilters>(
      state: PatientState,
      action: PayloadAction<{ key: K; value: PatientFilters[K] }>,
    ) {
      state.filters[action.payload.key] = action.payload.value;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    resetFilters(state) {
      state.filters = initialState.filters;
    },
  },
});

export const { setViewMode, setSelectedPatientId, setFilter, setLoading, resetFilters } =
  patientSlice.actions;
export default patientSlice.reducer;

// Selectors
export const selectAllPatients = (state: RootState) => state.patients.patients;
export const selectViewMode    = (state: RootState) => state.patients.viewMode;
export const selectFilters     = (state: RootState) => state.patients.filters;
export const selectSelectedId  = (state: RootState) => state.patients.selectedPatientId;

export const selectFilteredPatients = createSelector(
  [selectAllPatients, selectFilters],
  (patients, filters) =>
    patients.filter((p) => {
      const q = filters.search.toLowerCase();
      const matchSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.doctor.toLowerCase().includes(q) ||
        p.condition.toLowerCase().includes(q);
      const matchStatus = filters.status === 'All' || p.status === filters.status;
      const matchDept   = filters.department === 'All' || p.department === filters.department;
      return matchSearch && matchStatus && matchDept;
    }),
);

export const selectSelectedPatient = createSelector(
  [selectAllPatients, selectSelectedId],
  (patients, id) => patients.find((p) => p.id === id) ?? null,
);
