import React, { useState } from 'react';
import { TimelineEvent } from '../../components';
import { SkeletonCard } from '../../components';
import { useCurrentUser, usePatientRecords } from '../../hooks/usePatientData';

type FilterType = 'all' | 'month' | '6months' | 'year';
type EventType = 'all' | 'Hospital Visit' | 'Diagnosis' | 'Prescription' | 'Lab Report' | 'Vaccination' | 'Surgery';

export function MedicalTimeline() {
  const [timeFilter, setTimeFilter] = useState<FilterType>('all');
  const [typeFilter, setTypeFilter] = useState<EventType>('all');
  const { profile, loading: authLoading } = useCurrentUser();
  const healthId = profile?.health_id || null;
  const { data, loading: dataLoading } = usePatientRecords(healthId);

  const loading = authLoading || dataLoading;

  // Build timeline events from real data
  const timelineEvents = [
    // Lab reports
    ...data.labReports.map((r: any) => ({
      type: 'Lab Report' as const,
      date: r.date,
      title: r.test_name,
      description: `Status: ${r.status}`,
      hospital: r.hospital,
      doctor: r.doctor,
      details: { 'Hospital': r.hospital, 'Doctor': r.doctor, 'Status': r.status },
    })),
    // Prescriptions
    ...data.prescriptions.map((p: any) => ({
      type: 'Prescription' as const,
      date: p.date,
      title: 'Prescription Created',
      description: `${(p.medicines as any[]).length} medication(s) prescribed`,
      hospital: p.hospital,
      doctor: p.doctor_name,
      details: { 'Medicines': (p.medicines as any[]).map((m: any) => m.name).join(', ') },
    })),
    // Vaccinations
    ...data.vaccinations.map((v: any) => ({
      type: 'Vaccination' as const,
      date: v.date,
      title: v.vaccine,
      description: `Dose: ${v.dose}`,
      hospital: v.hospital,
      doctor: v.administered_by,
      details: { 'Administered By': v.administered_by, 'Next Due': v.next_due || 'N/A' },
    })),
    // Health logs as episodes
    ...data.healthLogs.map((l: any) => ({
      type: 'Diagnosis' as const,
      date: l.date,
      title: `Health Episode: ${l.symptom}`,
      description: `Severity: ${l.severity}, Duration: ${l.duration} days`,
      hospital: '-',
      doctor: '-',
      details: { 'Symptom': l.symptom, 'Severity': l.severity, 'Notes': l.notes || 'None' },
    })),
  ].sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Apply filters
  const filteredEvents = timelineEvents.filter(event => {
    // Time filter
    const eventDate = new Date(event.date);
    const now = new Date();
    if (timeFilter === 'month') {
      const oneMonthAgo = new Date(now.setMonth(now.getMonth() - 1));
      if (eventDate < oneMonthAgo) return false;
    } else if (timeFilter === '6months') {
      const sixMonthsAgo = new Date(now.setMonth(now.getMonth() - 6));
      if (eventDate < sixMonthsAgo) return false;
    } else if (timeFilter === 'year') {
      const oneYearAgo = new Date(now.setFullYear(now.getFullYear() - 1));
      if (eventDate < oneYearAgo) return false;
    }

    // Type filter
    if (typeFilter !== 'all' && event.type !== typeFilter) return false;

    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Medical Timeline</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Your complete medical history in one place
          </p>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {filteredEvents.length} events
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card-solid p-4 flex flex-col sm:flex-row gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Time Range</label>
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'all', label: 'All Time' },
              { id: 'month', label: 'Last Month' },
              { id: '6months', label: 'Last 6 Months' },
              { id: 'year', label: 'Last Year' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setTimeFilter(f.id as FilterType)}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                  timeFilter === f.id
                    ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Event Type</label>
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'all', label: 'All' },
              { id: 'Hospital Visit', label: 'Visits' },
              { id: 'Lab Report', label: 'Labs' },
              { id: 'Prescription', label: 'Rx' },
              { id: 'Vaccination', label: 'Vaccines' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setTypeFilter(f.id as EventType)}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                  typeFilter === f.id
                    ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} lines={3} />)}
        </div>
      )}

      {/* Empty state for new patients */}
      {!loading && timelineEvents.length === 0 && (
        <div className="glass-card-solid p-8 text-center">
          <p className="text-gray-500 dark:text-gray-400">No medical history yet. Your records will appear here as you visit doctors.</p>
        </div>
      )}

      {/* Timeline */}
      {!loading && filteredEvents.length > 0 && (
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />
          <div className="space-y-4 pl-2">
            {filteredEvents.map((event, index) => (
              <TimelineEvent
                key={`${event.type}-${event.date}-${index}`}
                type={event.type}
                date={event.date}
                title={event.title}
                description={event.description}
                hospital={event.hospital}
                doctor={event.doctor}
                details={event.details}
              />
            ))}
          </div>
        </div>
      )}

      {/* No results after filtering */}
      {!loading && timelineEvents.length > 0 && filteredEvents.length === 0 && (
        <div className="glass-card-solid p-8 text-center">
          <p className="text-gray-500 dark:text-gray-400">No events found for the selected filters.</p>
        </div>
      )}
    </div>
  );
}
