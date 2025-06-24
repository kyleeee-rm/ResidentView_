    const pending = [5, 8, 7, 6, 9, 10, 6, 8, 4, 5, 7, 6];
    const approved = [10, 15, 12, 14, 16, 18, 12, 14, 13, 15, 17, 19];
    const released = [6, 7, 8, 9, 11, 13, 10, 12, 14, 11, 13, 15];
    const rejected = [2, 3, 2, 4, 3, 2, 4, 3, 5, 2, 1, 3];

   // Data storage for applicants and their checklist states - ALL SET TO PENDING BY DEFAULT
let applicantsData = [
  {
    name: 'Juan Dela Cruz',
    age: 28,
    address: '123 Main St, Barangay Market Area',
    birthplace: 'Manila, Philippines',
    civilStatus: 'Single',
    requestedBy: 'Juan Dela Cruz',
    placeIssued: 'Barangay Market Area',
    dateIssued: '2025-06-24',
    docType: 'Barangay Clearance',
    status: 'Pending',
    tempStatus: 'Pending',
    purpose: 'Employment purposes',
    ctcnum: 'CTC-001-2025'
  },
  {
    name: 'Maria Santos',
    age: 32,
    address: '456 Oak Ave, Barangay Market Area',
    birthplace: 'Quezon City, Philippines',
    civilStatus: 'Married',
    requestedBy: 'Maria Santos',
    placeIssued: 'Barangay Market Area',
    dateIssued: '2025-06-24',
    docType: 'Certificate of Indigency',
    status: 'Pending',
    tempStatus: 'Pending',
    purpose: 'Medical assistance',
    ctcnum: ''
  },
  {
    name: 'Pedro Rodriguez',
    age: 45,
    address: '789 Pine St, Barangay Market Area',
    birthplace: 'Caloocan, Philippines',
    civilStatus: 'Married',
    requestedBy: 'Pedro Rodriguez',
    placeIssued: 'Barangay Market Area',
    dateIssued: '2025-06-24',
    docType: 'Business Permit',
    status: 'Pending',
    tempStatus: 'Pending',
    purpose: 'Start new business',
    ctcnum: ''
  },
  {
    name: 'Ana Garcia',
    age: 29,
    address: '321 Elm St, Barangay Market Area',
    birthplace: 'Pasig, Philippines',
    civilStatus: 'Single',
    requestedBy: 'Ana Garcia',
    placeIssued: 'Barangay Market Area',
    dateIssued: '2025-06-24',
    docType: 'Barangay ID',
    status: 'Pending',
    tempStatus: 'Pending',
    purpose: 'Identification purposes',
    ctcnum: ''
  },
  {
    name: 'Carlos Mendoza',
    age: 23,
    address: '654 Maple Ave, Barangay Market Area',
    birthplace: 'Marikina, Philippines',
    civilStatus: 'Single',
    requestedBy: 'Carlos Mendoza',
    placeIssued: 'Barangay Market Area',
    dateIssued: '2025-06-24',
    docType: 'Certificate of Residency',
    status: 'Pending',
    tempStatus: 'Pending',
    purpose: 'School enrollment',
    ctcnum: ''
  }
];

let votersData = [
  {
    id: 1,
    fullName: 'Juan Dela Cruz',
    sex: 'Male',
    address: '123 Main St, Barangay Market Area',
    birthday: '1996-06-24', // Calculated from age 28
    birthplace: 'Manila, Philippines',
    age: 28,
    civilStatus: 'Single',
    contactNumber: '09171234567'
  },
  {
    id: 2,
    fullName: 'Maria Santos',
    sex: 'Female',
    address: '456 Oak Ave, Barangay Market Area',
    birthday: '1992-06-24', // Calculated from age 32
    birthplace: 'Quezon City, Philippines',
    age: 32,
    civilStatus: 'Married',
    contactNumber: '09189876543'
  },
  {
    id: 3,
    fullName: 'Pedro Rodriguez',
    sex: 'Male',
    address: '789 Pine St, Barangay Market Area',
    birthday: '1979-06-24', // Calculated from age 45
    birthplace: 'Caloocan, Philippines',
    age: 45,
    civilStatus: 'Married',
    contactNumber: '09171234568'
  },
  {
    id: 4,
    fullName: 'Ana Garcia',
    sex: 'Female',
    address: '321 Elm St, Barangay Market Area',
    birthday: '1995-06-24', // Calculated from age 29
    birthplace: 'Pasig, Philippines',
    age: 29,
    civilStatus: 'Single',
    contactNumber: '09189876544'
  },
  {
    id: 5,
    fullName: 'Carlos Mendoza',
    sex: 'Male',
    address: '654 Maple Ave, Barangay Market Area',
    birthday: '2001-06-24', // Calculated from age 23
    birthplace: 'Marikina, Philippines',
    age: 23,
    civilStatus: 'Single',
    contactNumber: '09171234569'
  }
];
        // Initialize dashboard counts and hide completed applications
updateDashboardCounts();
window.addEventListener('DOMContentLoaded', function() {
     updateDocumentRequestsTable(); // or whatever function initializes your table
});

    // Load saved data on page load
    loadDataFromStorage();

//     // Update the table view after loading data
// updateDocumentRequestsTable();

    let currentApplicantIndex = -1;
    let hasUnsavedChanges = false;
    let hasUnsavedApprovedChanges = false;
    let hasUnsavedReleasedChanges = false;
    let selectedReleasedRows = new Set();
    let selectedRejectedRows = new Set();
    let isResidentsAccessGranted = false;
    let isAdminAccessGranted = false;
    let backupInterval = null;
    // These should always start as false on page load/refresh
    let isEditAccessGranted = false; // Add this for edit mode
    // const RESIDENTS_ACCESS_PASSWORD = "admin123";
    let isEditMode = false;
    // Session Management Variables
    let sessionTimeout = 30; // Default 30 minutes
    let warningTime = 5; // Default 5 minutes warning
    let enableSessionWarning = true;
    let sessionTimer = null;
    let warningTimer = null;
    let warningCountdownTimer = null;
    let lastActivity = Date.now();
    let isWarningShown = false;
    let sessionStartTime = Date.now();
    let selectedApprovedRows = new Set();

    // ADD new admin settings variables
let adminSettings = {
    loginUsername: "admin",
    loginPassword: "admin123",
    residentsPassword: "admin123",
    movePassword: "admin123", 
    editPassword: "admin123",
    releaseArchiveDuration: 30, // days
    backupSchedule: "daily",
    documentTypes: ["Birth Certificate", "Death Certificate", "Marriage Certificate", "CENOMAR", "Certificate of Residency"]
};

let loginAttempts = {
    failedAttempts: 0,
    lockoutUntil: null,
    maxAttempts: 3,
    lockoutDuration: 30, // minutes
    enableNotification: true,
    notificationEmail: ''
};

// Processing Requirements Management
// Initialize with default requirements if they don't exist
const documentRequirements = {
    'Barangay Clearance': ['Valid ID', 'Proof of Residency', 'Application Form', 'Payment Receipt'],
    'Certificate of Indigency': ['Valid ID', 'Birth Certificate', 'Application Form'],
    'Business Permit': ['DTI Registration', 'BIR Certificate', 'Valid ID', 'Business Plan'],
    'Barangay ID': ['Birth Certificate', '2 pcs 1x1 ID Picture', 'Application Form'],
    'Certificate of Residency': ['Valid ID', 'Birth Certificate', 'Proof of Address']
};

let currentDocTypeForRequirements = '';
let requirementsChanged = false;




function initializeChecklistStates() {
  applicantsData.forEach(applicant => {
    const requirements = documentRequirements[applicant.docType] || [];
    
    // Initialize checklist states if they don't exist
    if (!applicant.checklistStates) {
      applicant.checklistStates = new Array(requirements.length).fill(false);
    }
    if (!applicant.tempChecklistStates) {
      applicant.tempChecklistStates = [...applicant.checklistStates];
    }
  });
}
function syncApplicantChecklists() {
    applicantsData.forEach(applicant => {
        const requirements = documentRequirements[applicant.docType] || [];
        applicant.checklist = [...requirements];
        
        // Preserve existing states or initialize with false
        const newLength = requirements.length;
        const oldLength = applicant.checklistStates?.length || 0;
        
        // Resize arrays to match new requirements
        applicant.checklistStates = Array(newLength).fill(false);
        applicant.tempChecklistStates = Array(newLength).fill(false);
    });
}


// Add this toast function to your JavaScript
function showToast(message, type = 'info', duration = 4000) {
  console.log('showToast called:', message, type); // Debug log
  
  const container = document.getElementById('toastContainer');
  console.log('Toast container found:', container); // Debug log
  
  if (!container) {
    console.error('Toast container not found!');
    return;
  }
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  const icons = {
    success: '✓',
    error: '✕',
    info: 'ℹ'
  };
  
  toast.innerHTML = `
    <span class="toast-icon">${icons[type] || icons.info}</span>
    <span class="toast-message">${message}</span>
    <button class="toast-close" onclick="closeToast(this)">&times;</button>
    <div class="toast-progress"></div>
  `;
  
  container.appendChild(toast);
   console.log('Toast appended to container'); // Debug log
  
  // Auto remove after duration
  setTimeout(() => {
    if (toast.parentNode) {
      removeToast(toast);
    }
  }, duration);
}

function closeToast(button) {
  const toast = button.closest('.toast');
  removeToast(toast);
}

function removeToast(toast) {
  toast.classList.add('slide-out');
  setTimeout(() => {
    if (toast.parentNode) {
      toast.parentNode.removeChild(toast);
    }
  }, 300);
}

// function showProgressToast(title, subtitle, duration = null) {
//   const container = document.getElementById('toastContainer');
//   if (!container) {
//     console.error('Toast container not found!');
//     return null;
//   }

//   const toast = document.createElement('div');
//   toast.className = 'toast progress';
  
//   toast.innerHTML = `
//     <div class="toast-spinner"></div>
//     <div class="toast-message-container">
//     <div class="toast-icon"></div>
//       <div class="toast-title">${title}</div>
//       <div class="toast-subtitle">${subtitle}</div>
//     </div>
//     <button class="toast-close" onclick="closeToast(this)">&times;</button>
//     ${duration ? '<div class="toast-progress"></div>' : ''}
//   `;
  
//   container.appendChild(toast);
  
//   // Auto remove after duration if specified
//   if (duration) {
//     setTimeout(() => {
//       if (toast.parentNode) {
//         removeToast(toast);
//       }
//     }, duration);
//   }
  
//   return toast; // Return toast element for further manipulation
// }

function showProgressToast(progressTitle, progressSubtitle, successTitle, successSubtitle, processingTime = 900, successDisplayTime = 3000) {
  const container = document.getElementById('toastContainer');
  if (!container) {
    console.error('Toast container not found!');
    return null;
  }

  const toast = document.createElement('div');
  toast.className = 'toast progressing';
  
  toast.innerHTML = `
    <div class="toast-spinner"></div>
    <div class="toast-message-container">
      <div class="toast-title">${progressTitle}</div>
      <div class="toast-subtitle">${progressSubtitle}</div>
    </div>
    <button class="toast-close" onclick="closeToast(this)">&times;</button>
    <div class="toast-progress"></div>
  `;
  
  container.appendChild(toast);
  
  // Auto-update to success after processing time
  setTimeout(() => {
    if (toast && toast.parentNode) {
      // Update content
      const titleElement = toast.querySelector('.toast-title');
      const subtitleElement = toast.querySelector('.toast-subtitle');
      const spinnerElement = toast.querySelector('.toast-spinner');
      
      if (titleElement) titleElement.textContent = successTitle;
      if (subtitleElement) subtitleElement.textContent = successSubtitle;
      
      // Replace spinner with checkmark
      if (spinnerElement) {
        spinnerElement.innerHTML = '';
        spinnerElement.className = 'toast-icon success-icon';
      }
      
      // Add success styling
      toast.classList.add('success');
      
      // Remove after showing success
      setTimeout(() => {
        if (toast.parentNode) {
          removeToast(toast);
        }
      }, successDisplayTime);
    }
  }, processingTime);
  
  return toast; // Return toast element for manual control if needed
}

// // Simplified usage examples:
// function exampleSaveProgressToast() {
//   showProgressToast(
//     'Saving Changes',
//     'Please wait...',
//     'Changes Saved',
//     'All changes have been saved successfully'
//   );
// }

// function exampleMoveProgressToast(count, targetTab) {
//   showProgressToast(
//     'Moving Applications',
//     `Moving ${count} application(s) to ${targetTab}...`,
//     'Applications Moved',
//     `Successfully moved ${count} application(s) to ${targetTab}`,
//     2500 // Custom processing time
//   );
// }


// Add this function to reset access states on page load
function resetAccessStates() {
    isResidentsAccessGranted = false;
    isAdminAccessGranted = false;
    isEditAccessGranted = false;
    isEditMode = false;
    
    // Clear any displayed password modals
    const modals = ['adminPasswordModal', 'passwordModal', 'movePasswordModal'];
    modals.forEach(modalId => {
        const modal = document.getElementById(modalId);
        if (modal) modal.style.display = 'none';
    });
}

// Call this when page loads
window.addEventListener('load', resetAccessStates);
document.addEventListener('DOMContentLoaded', function() {
  populateVotersTable();
});


    // Update dashboard counts - now all will start as pending
    function updateDashboardCounts() {
      const pendingCount = applicantsData.filter(app => app.status === 'Pending' || app.status === 'In Progress').length;
      const approvedCount = applicantsData.filter(app => app.status === 'Approved' || app.status === 'Ready for Approval').length;
      const releasedCount = applicantsData.filter(app => app.status === 'Released').length;
      const rejectedCount = applicantsData.filter(app => app.status === 'Rejected').length;

      document.getElementById('pendingCount').textContent = pendingCount;
      document.getElementById('approvedCount').textContent = approvedCount;
      document.getElementById('releasedCount').textContent = releasedCount;
      document.getElementById('rejectedCount').textContent = rejectedCount;
    }

    // Initialize dashboard counts
    updateDashboardCounts();
    // Hide completed applications from dashboard view
updateDocumentRequestsTable();
syncApplicantChecklists();

    const ctx = document.getElementById('statusChart').getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
          {
            label: 'Pending',
            data: pending,
            backgroundColor: '#f1c40f'
          },
          {
            label: 'Approved',
            data: approved,
            backgroundColor: '#2ecc71'
          },
          {
            label: 'Released',
            data: released,
            backgroundColor: '#3498db'
          },
          {
            label: 'Rejected',
            data: rejected,
            backgroundColor: '#e74c3c'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top'
          },
          title: {
            display: false
          }
        },
        scales: {
          x: {
            ticks: {
              maxRotation: 0
            }
          }
        }
      }
    });

  
function showSection(id) {
  // Hide all sections
  document.getElementById('dashboard').style.display = 'none';
  document.getElementById('documentRequests').style.display = 'none';
  document.getElementById('approvedDocuments').style.display = 'none';
  document.getElementById('releasedDocuments').style.display = 'none';
  document.getElementById('rejectedDocuments').style.display = 'none';
  document.getElementById('voters').style.display = 'none';
  document.getElementById('adminSettings').style.display = 'none';
  
  // Remove active class from ALL sidebar links first (this ensures only one tab is active at a time)
  const sidebarItems = document.querySelectorAll('.sidebar a');
  sidebarItems.forEach(item => {
    item.classList.remove('active');
  });
  
  // Add active class to the clicked item
  const activeItem = document.querySelector(`.sidebar a[onclick="showSection('${id}')"]`);
  if (activeItem) {
    activeItem.classList.add('active');
  }
  
  // Check if trying to access voters section
  if (id === 'voters') {
      // Access already granted, show voters section
      document.getElementById(id).style.display = 'block';
      populateVotersTable();
  }else {
    // For other sections, show normally
    document.getElementById(id).style.display = 'block';
    
    if (id === 'approvedDocuments') {
      populateApprovedTable();
    } else if (id === 'documentRequests') {
      updateDocumentRequestsTable();
    } else if (id === 'releasedDocuments') {
      populateReleasedTable();
    } else if (id === 'rejectedDocuments') {
      populateRejectedTable();
    } else if (id === 'dashboard') {
      // Hide approved, released, and rejected from dashboard
      updateDocumentRequestsTable();
    } else if (id === 'adminSettings') {
      if (!isAdminAccessGranted) {
        document.getElementById('adminPasswordModal').style.display = 'flex';
        document.getElementById('adminPasswordInput').focus();
        return;
      } else {
        document.getElementById(id).style.display = 'block';
        loadAdminSettings();
      }
    }
  }
}

    function toggleSearch() {
      const searchInput = document.getElementById('searchInput');
      if (searchInput.style.display === 'block') {
        searchInput.style.display = 'none';
        searchInput.value = '';
        filterTable('');
      } else {
        searchInput.style.display = 'block';
        searchInput.focus();
      }
    }

    function filterTable(searchTerm) {
      const tableBody = document.getElementById('applicantsTableBody');
      const rows = tableBody.getElementsByTagName('tr');
      
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const name = row.cells[0].textContent.toLowerCase();
        const docType = row.cells[1].textContent.toLowerCase();
        const date = row.cells[2].textContent.toLowerCase();
        const status = row.cells[3].textContent.toLowerCase();
        
        const searchLower = searchTerm.toLowerCase();
        
        if (searchTerm === '' || 
            name.includes(searchLower) || 
            docType.includes(searchLower) || 
            date.includes(searchLower) || 
            status.includes(searchLower)) {
          row.style.display = '';
        } else {
          row.style.display = 'none';
        }
      }
        // If there's an active search, don't apply other filters
        if (searchTerm === '') {
        applyFilters();
      }
    }

    function toggleFilter() {
        const filterPanel = document.getElementById('filterPanel');
        filterPanel.classList.toggle('active');
    }
  function applyFilters() {
      const docTypeFilters = getSelectedDocTypes();
      const statusFilters = getSelectedStatuses();
      const dateFrom = document.getElementById('dateFrom').value;
      const dateTo = document.getElementById('dateTo').value;
      
      const tableBody = document.getElementById('applicantsTableBody');
      const rows = tableBody.getElementsByTagName('tr');
      
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const docType = row.cells[1].textContent;
        const statusText = row.cells[3].querySelector('span').textContent.trim();
        const date = row.cells[2].textContent;
        
        let showRow = true;
        
        // Filter by document type (multi-select)
        if (docTypeFilters.length > 0 && !docTypeFilters.includes(docType)) {
          showRow = false;
        }
        
        // Filter by status (multi-select)
        if (statusFilters.length > 0 && !statusFilters.includes(statusText)) {
          showRow = false;
        }
        
        // Filter by date range
        // Filter by date range
        if (dateFrom && date < dateFrom) {
          showRow = false;
        }
        if (dateTo && date > dateTo) {
          showRow = false;
        }
        row.style.display = showRow ? '' : 'none';
      }
    }

    function toggleDocTypeDropdown() {
      const dropdown = document.getElementById('docTypeDropdown');
      const container = dropdown.parentElement;
      dropdown.classList.toggle('active');
      container.classList.toggle('active');
    }

    function updateDocTypeFilter() {
      const checkboxes = document.querySelectorAll('#docTypeDropdown input[type="checkbox"]');
      const selected = [];
      
      checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
          selected.push(checkbox.value);
        }
      });
      
      // Update display text
      const display = document.getElementById('docTypeDisplay');
      if (selected.length === 0) {
        display.textContent = 'All Types';
      } else if (selected.length === 1) {
        display.textContent = selected[0];
      } else {
        display.textContent = `${selected.length} types selected`;
      }
      
      // Apply filters
      applyFilters();
    }


    function updateStatusFilter() {
      // Update display text for status filter
      const statusFilters = getSelectedStatuses();
      // You can add status display update here if needed
      
      applyFilters();
    }
        

    function getSelectedStatuses() {
      const checkboxes = document.querySelectorAll('.status-checkbox-container input[type="checkbox"]:checked');
      return Array.from(checkboxes).map(cb => cb.value);
    }

    function getSelectedDocTypes() {
      const checkboxes = document.querySelectorAll('#docTypeDropdown input[type="checkbox"]:checked');
      return Array.from(checkboxes).map(cb => cb.value);
    }

    function clearFilters() {
      // Clear document type checkboxes
      const docTypeCheckboxes = document.querySelectorAll('#docTypeDropdown input[type="checkbox"]');
      docTypeCheckboxes.forEach(cb => cb.checked = false);
      document.getElementById('docTypeDisplay').textContent = 'All Types';
      
      //document.getElementById('statusFilter').value = '';
      document.getElementById('dateFrom').value = '';
      document.getElementById('dateTo').value = '';

      // Clear status filters
      const statusCheckboxes = document.querySelectorAll('.status-checkbox-container input[type="checkbox"]');
      statusCheckboxes.forEach(cb => cb.checked = false);
      
      // Show all rows
      const tableBody = document.getElementById('applicantsTableBody');
      const rows = tableBody.getElementsByTagName('tr');
      for (let i = 0; i < rows.length; i++) {
        rows[i].style.display = '';
      }
    }

    // Close dropdown when clicking outside
    document.addEventListener('click', function(event) {
      const container = document.querySelector('.multi-select-container');
      const dropdown = document.getElementById('docTypeDropdown');
      
      if (container && !container.contains(event.target)) {
        dropdown.classList.remove('active');
        container.classList.remove('active');
      }
    });

function updateCTCNum() {
  const ctcValue = document.getElementById('ctcnumInput').value;
  applicantsData[currentApplicantIndex].ctcnum = ctcValue;
}

    function showApplicantModal(index, name, age, address,birthplace,civilStatus,requestedBy,placeIssued,dateIssued, documentType, purpose) {
      currentApplicantIndex = index;
      document.getElementById('applicantName').textContent = name;
      document.getElementById('age').textContent = age;
      document.getElementById('address').textContent = address;
      document.getElementById('birthplace').textContent = birthplace;
      document.getElementById('civilStatus').textContent = civilStatus;
      document.getElementById('requestedBy').textContent = requestedBy;
      document.getElementById('placeIssued').textContent = placeIssued;
      document.getElementById('dateIssued').textContent = dateIssued;
      document.getElementById('docType').textContent = documentType;
      // document.getElementById('status').textContent = status;
      document.getElementById('purpose').textContent = purpose;
      document.getElementById('ctcnumInput').value = applicantsData[index].ctcnum || '';
      
      
      const checklistDiv = document.getElementById('checklist');
      checklistDiv.innerHTML = '';
        // Get checklist from documentRequirements instead of parameter
      const checklist = documentRequirements[documentType] || [];
      
      // Get requirements from documentRequirements instead of passed checklist
      const requirements = documentRequirements[documentType] || [];
        // Initialize checklist states if they don't exist
      if (!applicantsData[index].checklistStates) {
        applicantsData[index].checklistStates = new Array(checklist.length).fill(false);
      }
      if (!applicantsData[index].tempChecklistStates) {
        applicantsData[index].tempChecklistStates = [...applicantsData[index].checklistStates];
      }
      if (checklist.length === 0) {
        document.getElementById('printbtn').disabled = false;
      } else {
        checklist.forEach((item, i) => {
          const label = document.createElement('label');
          const checkbox = document.createElement('input');
          checkbox.type = 'checkbox';
          checkbox.checked = applicantsData[index].tempChecklistStates[i];
          checkbox.onchange = function() {
            handleChecklistChange(index, i, this.checked);
          };
          label.appendChild(checkbox);
          label.appendChild(document.createTextNode(item));
          checklistDiv.appendChild(label);
        });
        updateChecklistStatus();
      }
      
      document.getElementById('applicantModal').style.display = 'block';
    }

    function handleChecklistChange(applicantIndex, checklistIndex, isChecked) {
      // Auto-save the temporary state
      applicantsData[applicantIndex].tempChecklistStates[checklistIndex] = isChecked;
      
      // Check if this applicant has changes
      const hasChanges = !arraysEqual(
        applicantsData[applicantIndex].checklistStates,
        applicantsData[applicantIndex].tempChecklistStates
      );
      
      // Update visual indicators
      updateRowIndicator(applicantIndex, hasChanges);
      
      // Update the approve button state
      updateChecklistStatus();
      
      // Update global changes state
      updateGlobalChangesState();
      saveDataToStorage(); // Add this line
    }
    function toggleRequestReleased(applicantIndex, isChecked) {
      const applicant = applicantsData[applicantIndex];
      if (applicant.tempIsReleased === undefined) {
        applicant.tempIsReleased = applicant.isReleased || false;
      }
      applicant.tempIsReleased = isChecked;
      
      const hasChanges = (applicant.tempIsReleased !== (applicant.isReleased || false)) ||
                        !arraysEqual(applicant.checklistStates, applicant.tempChecklistStates) ||
                        applicant.status !== applicant.tempStatus;
      
      updateRowIndicator(applicantIndex, hasChanges);
      updateGlobalChangesState();
    }
        function arraysEqual(arr1, arr2) {
      if (arr1.length !== arr2.length) return false;
      for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) return false;
      }
      return true;
    }

    function updateRowIndicator(applicantIndex, hasChanges) {
      const row = document.getElementById(`row-${applicantIndex}`);
      const indicator = document.getElementById(`indicator-${applicantIndex}`);
      
      if (hasChanges) {
        row.classList.add('row-changed');
        indicator.style.display = 'inline';
      } else {
        row.classList.remove('row-changed');
        indicator.style.display = 'none';
      }
    }

function updateGlobalChangesState() {
  hasUnsavedChanges = applicantsData.some(applicant => 
    !arraysEqual(applicant.checklistStates, applicant.tempChecklistStates) ||
    applicant.status !== applicant.tempStatus ||
    (applicant.tempIsReleased !== undefined && applicant.tempIsReleased !== (applicant.isReleased || false)) // ADD THIS
  );
  
  const saveButton = document.getElementById('saveButton');
  if (hasUnsavedChanges) {
    saveButton.classList.add('has-changes');
    saveButton.textContent = 'Save Changes';
  } else {
    saveButton.classList.remove('has-changes');
    saveButton.textContent = 'Save';
  }
}
function saveAllChanges() {
  if (!hasUnsavedChanges) {
    showToast('No unsaved changes to save.', 'info');
    return;
  }

  // Show confirmation modal
  showConfirmationModal(
    'Save All Changes',
    'Are you sure you want to save all changes? This action cannot be undone.',
    'Save Changes',
    'Cancel',
    () => {
      // Apply all temporary states to actual states and update status
      applicantsData.forEach((applicant, index) => {
        applicant.checklistStates = [...applicant.tempChecklistStates];
        const oldStatus = applicant.status;
        applicant.status = applicant.tempStatus;
        
        // Clear temporary status after applying
        applicant.tempStatus = applicant.status;
        
        // Handle Released checkbox logic FIRST - regardless of current status
        if (applicant.tempIsReleased !== undefined) {
          const wasReleased = applicant.isReleased || false;
          applicant.isReleased = applicant.tempIsReleased;
          
          // If Released checkbox is checked, change status to Released
          if (!wasReleased && applicant.tempIsReleased) {
            applicant.status = 'Released';
            applicant.releaseDate = new Date().toISOString().split('T')[0];
          }
          
          // Reset temp value
          applicant.tempIsReleased = applicant.isReleased;
        }
        
        // Set approval date when status changes to Approved
        if (oldStatus !== 'Approved' && applicant.status === 'Approved') {
          applicant.approvalDate = new Date().toISOString().split('T')[0];
        }
        
        // Set rejection date when status changes to Rejected
        if (oldStatus !== 'Rejected' && applicant.status === 'Rejected') {
          applicant.rejectionDate = new Date().toISOString().split('T')[0];
        }
        
        // Update status based on checklist completion - only for non-final statuses
        if (applicant.status !== 'Approved' && applicant.status !== 'Released' && applicant.status !== 'Rejected') {
          const allCompleted = applicant.checklistStates.every(state => state === true);
          const hasAnyCompleted = applicant.checklistStates.some(state => state === true);

          if (applicant.status === 'Pending' || applicant.status === 'In Progress' || applicant.status === 'Ready for Approval') {
            if (allCompleted && applicant.checklist.length > 0) {
              applicant.status = 'Ready for Approval';
            } else if (hasAnyCompleted) {
              applicant.status = 'In Progress';
            } else {
              applicant.status = 'Pending';
            }
          }
        }
        
        updateRowIndicator(index, false);
        updateTableRowStatus(index);
      });

      hasUnsavedChanges = false;
      updateGlobalChangesState();
      updateDashboardCounts();
      updateDocumentRequestsTable();
      updateDocumentRequestsTable();
      // If approved tab is currently shown, refresh it
      if (document.getElementById('approvedDocuments').style.display === 'block') {
        populateApprovedTable();
      }
      // ADD THIS: If released tab is currently shown, refresh it
      if (document.getElementById('releasedDocuments').style.display === 'block') {
        populateReleasedTable();
      }
      
              showProgressToast(
                'Saving Changes',
                'Please wait...',
                'Settings saved successfully!'
              );
      saveDataToStorage();
    }
  );
}

// Modal confirmation function
function showConfirmationModal(title, message, confirmText, cancelText, onConfirm, onCancel = null) {
  // Create modal overlay
  const overlay = document.createElement('div');
  overlay.className = 'confirmation-modal';

  // Create modal content
  const modal = document.createElement('div');
  modal.className = 'confirmation-modal-content';

  // Create modal header
  const header = document.createElement('div');
  header.className = 'confirmation-modal-header';
  header.innerHTML = `<h3>${title}</h3>`;

  // Create modal body
  const body = document.createElement('div');
  body.className = 'confirmation-modal-body';

  // Create message
  const messageElement = document.createElement('p');
  messageElement.className = 'confirmation-modal-message';
  messageElement.textContent = message;

  // Create button container
  const buttonContainer = document.createElement('div');
  buttonContainer.className = 'confirmation-modal-buttons';

  // Create cancel button
  const cancelBtn = document.createElement('button');
  cancelBtn.className = 'modal-cancel-btn';
  cancelBtn.textContent = cancelText;

  // Create confirm button
  const confirmBtn = document.createElement('button');
  confirmBtn.className = 'modal-confirm-btn';
  confirmBtn.textContent = confirmText;

  // Add event listeners
  cancelBtn.addEventListener('click', () => {
    closeModal();
    if (onCancel) onCancel();
  });

  confirmBtn.addEventListener('click', () => {
    // Show saving toast and close modal
  //     showProgressToast(
  //   'Saving Changes',
  //   'Please wait...',
  //   'Changes Saved',
  //   'All changes have been saved successfully'
  // );
    closeModal();
    onConfirm();
  });

  // Close modal on overlay click
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      closeModal();
      if (onCancel) onCancel();
    }
  });

  // Close modal on escape key
  document.addEventListener('keydown', handleEscape);

  function closeModal() {
    overlay.classList.add('fade-out');
    modal.classList.add('slide-out');
    setTimeout(() => {
      if (document.body.contains(overlay)) {
        document.body.removeChild(overlay);
      }
      document.removeEventListener('keydown', handleEscape);
    }, 300);
  }

  function handleEscape(e) {
    if (e.key === 'Escape') {
      closeModal();
      if (onCancel) onCancel();
    }
  }

  // Assemble the modal
  buttonContainer.appendChild(cancelBtn);
  buttonContainer.appendChild(confirmBtn);
  
  body.appendChild(messageElement);
  body.appendChild(buttonContainer);
  
  modal.appendChild(header);
  modal.appendChild(body);
  
  overlay.appendChild(modal);
  document.body.appendChild(overlay);

}
    

function updateTableRowStatus(applicantIndex) {
  const row = document.getElementById(`row-${applicantIndex}`);
  const applicant = applicantsData[applicantIndex];
  
  // Update the status cell (4th column, index 3)
  const statusCell = row.cells[3];
  statusCell.innerHTML = `<span class="status-${applicant.status.toLowerCase().replace(/\s+/g, '-')}">${applicant.status}</span>`;
  
  // Rebuild the view button with correct parameters
  const viewButton = row.cells[4].querySelector('.view-button');
  if (viewButton) {
    // Reconstruct the onclick with all the correct parameters
    const newOnClick = `showApplicantModal(${applicantIndex}, '${applicant.name}','${applicant.age}', '${applicant.address}', '${applicant.birthplace}', '${applicant.civilStatus}', '${applicant.requestedBy}','${applicant.placeIssued}','${applicant.dateIssued}','${applicant.purpose}','${applicant.ctcnum}', ${JSON.stringify(applicant.checklist).replace(/"/g, "'")})`;
    viewButton.setAttribute('onclick', newOnClick);
  }
}

    function closeModal() {
      document.getElementById('applicantModal').style.display = 'none';
    }

    function updateChecklistStatus() {
      const checklistItems = document.querySelectorAll('#checklist input[type="checkbox"]');
      const printbtn = document.getElementById('printbtn');
      const allChecked = [...checklistItems].every(checkbox => checkbox.checked);
      printbtn.disabled = checklistItems.length > 0 && !allChecked;
    }

function approveApplication() {
      // Mark as approved in temporary state
      applicantsData[currentApplicantIndex].tempStatus = 'Approved';
      
      // Check if this creates a change
      const hasChanges = applicantsData[currentApplicantIndex].status !== applicantsData[currentApplicantIndex].tempStatus ||
                        !arraysEqual(
                          applicantsData[currentApplicantIndex].checklistStates,
                          applicantsData[currentApplicantIndex].tempChecklistStates
                        );
      
      // Update visual indicators
      updateRowIndicator(currentApplicantIndex, hasChanges);
      updateGlobalChangesState();
        showProgressToast(
          'Saving Changes',           // Progress title
          'Please wait...',           // Progress subtitle  
          'Application APPROVED',            // Success title
          'Click "Save Changes" to apply.',
          1000  // Success subtitle
        );      
      // showSavingToast('Application APPROVED. Click "Save Changes" to apply.', 'success');
      closeModal();
  };


    function rejectApplication() {
          // Mark as rejected in temporary state
          applicantsData[currentApplicantIndex].tempStatus = 'Rejected';
          
          // Check if this creates a change
          const hasChanges = applicantsData[currentApplicantIndex].status !== applicantsData[currentApplicantIndex].tempStatus ||
                            !arraysEqual(
                              applicantsData[currentApplicantIndex].checklistStates,
                              applicantsData[currentApplicantIndex].tempChecklistStates
                            );
              
          
          // Update visual indicators
          updateRowIndicator(currentApplicantIndex, hasChanges);
          updateGlobalChangesState();
        showProgressToast(
          'Saving Changes',           // Progress title
          'Please wait...',           // Progress subtitle  
          'Application REJECTED',            // Success title
          'Click "Save Changes" to apply.',
          // 1000  // Success subtitle
        );
        // showToast('Application REJECTED. Click "Save Changes" to apply.', 'success');
        closeModal();
        };

    // Close modal when clicking outside of it
    window.onclick = function(event) {
      const modal = document.getElementById('applicantModal');
      if (event.target == modal) {
        closeModal();
      }
    }

    // Warn user about unsaved changes when leaving the page
    window.addEventListener('beforeunload', function(e) {
      if (hasUnsavedChanges || hasUnsavedApprovedChanges || hasUnsavedReleasedChanges) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    });

    // Approved Documents Functions
function populateApprovedTable() {
  // Only show applications with status 'Approved' (Released ones are filtered out by status)
  const approvedApplicants = applicantsData.filter(app => app.status === 'Approved');
  const tableBody = document.getElementById('approvedTableBody');
  tableBody.innerHTML = '';
 
  approvedApplicants.forEach((applicant, index) => {
    const actualIndex = applicantsData.indexOf(applicant);
    const invoiceNumber = `INV-${(actualIndex + 1).toString().padStart(4, '0')}`;
    const approvalDate = applicant.approvalDate || new Date().toISOString().split('T')[0];
   
    const row = document.createElement('tr');
    row.id = `approved-row-${actualIndex}`;
    row.innerHTML = `
      <td>${invoiceNumber}</td>
      <td>${applicant.name}<span class="change-indicator" id="approved-indicator-${actualIndex}" style="display:none;">*</span></td>
      <td>${applicant.docType}</td>
      <td>${approvalDate}</td>
      <td><button class="print-button" onclick="printDocument('${applicant.name}', '${applicant.docType}', '${invoiceNumber}')">Print</button></td>
    `;
    tableBody.appendChild(row);
  });

}

    function toggleApprovedSearch() {
      const searchInput = document.getElementById('approvedSearchInput');
      if (searchInput.style.display === 'block') {
        searchInput.style.display = 'none';
        searchInput.value = '';
        filterApprovedTable('');
      } else {
        searchInput.style.display = 'block';
        searchInput.focus();
      }
    }

    function filterApprovedTable(searchTerm) {
      const tableBody = document.getElementById('approvedTableBody');
      const rows = tableBody.getElementsByTagName('tr');
      
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
          const invoice = row.cells[0].textContent.toLowerCase();
          const name = row.cells[1].textContent.toLowerCase();
          const docType = row.cells[2].textContent.toLowerCase();
          const date = row.cells[3].textContent.toLowerCase();
          const released = row.cells[5].querySelector('input').checked ? 'released' : 'not released';
                  
        const searchLower = searchTerm.toLowerCase();
        
        if (searchTerm === '' || 
            invoice.includes(searchLower) || 
            name.includes(searchLower) || 
            docType.includes(searchLower) || 
            date.includes(searchLower) ||
            released.includes(searchLower)) {
          row.style.display = '';
        } else {
          row.style.display = 'none';
        }
      }
      
      if (searchTerm === '') {
        applyApprovedFilters();
      }
    }

    function toggleApprovedFilter() {
      const filterPanel = document.getElementById('approvedFilterPanel');
      filterPanel.classList.toggle('active');
    }

    function toggleApprovedDocTypeDropdown() {
      const dropdown = document.getElementById('approvedDocTypeDropdown');
      const container = dropdown.parentElement;
      dropdown.classList.toggle('active');
      container.classList.toggle('active');
    }

    function updateApprovedDocTypeFilter() {
      const checkboxes = document.querySelectorAll('#approvedDocTypeDropdown input[type="checkbox"]');
      const selected = [];
      
      checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
          selected.push(checkbox.value);
        }
      });
      
      const display = document.getElementById('approvedDocTypeDisplay');
      if (selected.length === 0) {
        display.textContent = 'All Types';
      } else if (selected.length === 1) {
        display.textContent = selected[0];
      } else {
        display.textContent = `${selected.length} types selected`;
      }
      
      applyApprovedFilters();
    }

    function getSelectedApprovedDocTypes() {
      const checkboxes = document.querySelectorAll('#approvedDocTypeDropdown input[type="checkbox"]:checked');
      return Array.from(checkboxes).map(cb => cb.value);
    }

    function applyApprovedFilters() {
      const docTypeFilters = getSelectedApprovedDocTypes();
      const dateFrom = document.getElementById('approvedDateFrom').value;
      const dateTo = document.getElementById('approvedDateTo').value;
      
      const tableBody = document.getElementById('approvedTableBody');
      const rows = tableBody.getElementsByTagName('tr');
      
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const docType = row.cells[2].textContent;
        const date = row.cells[3].textContent;
                
        let showRow = true;
        
        if (docTypeFilters.length > 0 && !docTypeFilters.includes(docType)) {
          showRow = false;
        }
        
        if (dateFrom && date < dateFrom) {
          showRow = false;
        }
        if (dateTo && date > dateTo) {
          showRow = false;
        }
                
        row.style.display = showRow ? '' : 'none';
      }
    }

    function clearApprovedFilters() {
      const docTypeCheckboxes = document.querySelectorAll('#approvedDocTypeDropdown input[type="checkbox"]');
      docTypeCheckboxes.forEach(cb => cb.checked = false);
      document.getElementById('approvedDocTypeDisplay').textContent = 'All Types';
      
      document.getElementById('approvedDateFrom').value = '';
      document.getElementById('approvedDateTo').value = '';
      
      const tableBody = document.getElementById('approvedTableBody');
      const rows = tableBody.getElementsByTagName('tr');
      for (let i = 0; i < rows.length; i++) {
        rows[i].style.display = '';
      }
    }

function printDocumentFromModal() {
    const docType = document.getElementById('docType').textContent;
    
    // Call the existing printDocument function with docType only
    printDocument(docType);
}

function printDocument(docType) {
    // Map document types to their respective HTML files
    const documentTemplates = {
        'Barangay Clearance': '../Admin/Cert-Admin/up-clear.html',
        'Certificate of Residency': '../Admin/Cert-Admin/up-reside.html',
        'First Time Job Seeker': '/Cert-Admin/up-jobseek.html',
        'Death Certificate': 'print-death-certificate.html',
        'Business Permit': 'print-business-permit.html',
        'Cedula': 'print-cedula.html'
    };

    const templateFile = documentTemplates[docType];

    if (templateFile) {
        window.open(templateFile, '_blank');
    } else {
        // Fallback to generic template
        window.open('print-generic.html', '_blank');
    }
}

function toggleRequestReleased(applicantIndex, isChecked) {
  const applicant = applicantsData[applicantIndex];
  
  if (applicant.tempIsReleased === undefined) {
    applicant.tempIsReleased = applicant.isReleased || false;
  }
  applicant.tempIsReleased = isChecked;
  
  const hasChanges = (applicant.tempIsReleased !== (applicant.isReleased || false)) ||
                     !arraysEqual(applicant.checklistStates, applicant.tempChecklistStates) ||
                     applicant.status !== applicant.tempStatus;
  
  updateRowIndicator(applicantIndex, hasChanges);
  updateGlobalChangesState();
}
    function updateApprovedChangesState() {
      hasUnsavedApprovedChanges = applicantsData.some(applicant => {
        const currentReleased = applicant.isReleased || false;
        const tempReleased = applicant.tempIsReleased !== undefined ? applicant.tempIsReleased : currentReleased;
        return currentReleased !== tempReleased;
      });
      
      const saveButton = document.getElementById('approvedSaveButton');
      if (saveButton) {
        if (hasUnsavedApprovedChanges) {
          saveButton.classList.add('has-changes');
          saveButton.textContent = 'Save Changes';
        } else {
          saveButton.classList.remove('has-changes');
          saveButton.textContent = 'Save';
        }
      }
    }
    

    function updateApprovedRowIndicator(applicantIndex, hasChanges) {
      const row = document.getElementById(`approved-row-${applicantIndex}`);
      const indicator = document.getElementById(`approved-indicator-${applicantIndex}`);
      
      if (row && indicator) {
        if (hasChanges) {
          row.classList.add('row-changed');
          indicator.style.display = 'inline';
        } else {
          row.classList.remove('row-changed');
          indicator.style.display = 'none';
        }
      }
    }

function saveApprovedChanges() {
  if (!hasUnsavedApprovedChanges) {
    showToast('No unsaved changes to save.', 'info');
    return;
  }

  // Show confirmation modal
  showConfirmationModal(
    'Confirm Save Changes',
    'Are you sure you want to save all release status changes?',
    'Yes, save changes',
    'Cancel',
    () => {
      // Apply all temporary states to actual states
      applicantsData.forEach((applicant) => {
        if (applicant.tempIsReleased !== undefined) {
          const oldReleased = applicant.isReleased || false;
          applicant.isReleased = applicant.tempIsReleased;
          
          if (applicant.tempIsReleased && !oldReleased) {
            applicant.releaseDate = new Date().toISOString().split('T')[0];
            applicant.status = 'Released';
            applicant.tempStatus = 'Released'; // Sync temp status
          }
          
          // Clear temporary state
          delete applicant.tempIsReleased;
        }
      });

      // Clear all visual indicators
      applicantsData.forEach((applicant, index) => {
        updateApprovedRowIndicator(index, false);
      });

      hasUnsavedApprovedChanges = false;
      updateApprovedChangesState();
      updateDashboardCounts();
      populateApprovedTable(); // Refresh the table
      populateReleasedTable(); // Refresh released table to show new releases

              showProgressToast(
                'Saving Changes',
                'Please wait...',
                'Settings saved successfully!'
              );
      saveDataToStorage();
    }
  );
}

// Released Documents Functions
function populateReleasedTable() {
  const releasedApplicants = applicantsData.filter(app => app.status === 'Released');
  const tableBody = document.getElementById('releasedTableBody');
  tableBody.innerHTML = '';
  
  releasedApplicants.forEach((applicant, index) => {
    const actualIndex = applicantsData.indexOf(applicant);
    const invoiceNumber = `INV-${(actualIndex + 1).toString().padStart(4, '0')}`;
    const releaseDate = applicant.releaseDate || new Date().toISOString().split('T')[0];
    
    const row = document.createElement('tr');
    row.innerHTML = `
      <td><input type="checkbox" class="checklist resident-checkbox" onchange="toggleRowSelection('released', ${actualIndex}, this.checked)"></td>
      <td>${invoiceNumber}</td>
      <td>${applicant.name}</td>
      <td>${applicant.docType}</td>
      <td>${releaseDate}</td>
    `;
    tableBody.appendChild(row);
  });
}

function toggleReleasedSearch() {
  const currentSection = document.querySelector('[style*="display: block"]').id;
  const searchInputId = currentSection === 'rejectedDocuments' ? 'rejectedSearchInput' : 'releasedSearchInput';
  const searchInput = document.getElementById(searchInputId);
  
  if (searchInput.style.display === 'block') {
    searchInput.style.display = 'none';
    searchInput.value = '';
    filterReleasedTable('');
  } else {
    searchInput.style.display = 'block';
    searchInput.focus();
  }
}

function filterReleasedTable(searchTerm) {
  const currentSection = document.querySelector('[style*="display: block"]').id;
  const tableBodyId = currentSection === 'rejectedDocuments' ? 'rejectedTableBody' : 'releasedTableBody';
  const tableBody = document.getElementById(tableBodyId);
  const rows = tableBody.getElementsByTagName('tr');
  
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    let searchFields = [];
    
    if (currentSection === 'rejectedDocuments') {
      searchFields = [
        row.cells[0].textContent.toLowerCase(), // name
        row.cells[1].textContent.toLowerCase(), // docType
        row.cells[2].textContent.toLowerCase()  // date
      ];
    } else {
      searchFields = [
        row.cells[0].textContent.toLowerCase(), // invoice
        row.cells[1].textContent.toLowerCase(), // name  
        row.cells[2].textContent.toLowerCase(), // docType
        row.cells[3].textContent.toLowerCase()  // date
      ];
    }
    
    const searchLower = searchTerm.toLowerCase();
    const shouldShow = searchTerm === '' || searchFields.some(field => field.includes(searchLower));
    
    row.style.display = shouldShow ? '' : 'none';
  }
  
  if (searchTerm === '') {
    applyReleasedFilters();
  }
}

function toggleReleasedFilter() {
  const currentSection = document.querySelector('[style*="display: block"]').id;
  const panelId = currentSection === 'rejectedDocuments' ? 'rejectedFilterPanel' : 'releasedFilterPanel';
  const filterPanel = document.getElementById(panelId);
  filterPanel.classList.toggle('active');
}

function toggleReleasedDocTypeDropdown() {
  const currentSection = document.querySelector('[style*="display: block"]').id;
  const dropdownId = currentSection === 'rejectedDocuments' ? 'rejectedDocTypeDropdown' : 'releasedDocTypeDropdown';
  const dropdown = document.getElementById(dropdownId);
  const container = dropdown.parentElement;
  dropdown.classList.toggle('active');
  container.classList.toggle('active');
}

    function updateReleasedDocTypeFilter() {
      const checkboxes = document.querySelectorAll('#releasedDocTypeDropdown input[type="checkbox"]');
      const selected = [];
      
      checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
          selected.push(checkbox.value);
        }
      });
      
      const display = document.getElementById('releasedDocTypeDisplay');
      if (selected.length === 0) {
        display.textContent = 'All Types';
      } else if (selected.length === 1) {
        display.textContent = selected[0];
      } else {
        display.textContent = `${selected.length} types selected`;
      }
      
      applyReleasedFilters();
    }

    function getSelectedReleasedDocTypes() {
      const checkboxes = document.querySelectorAll('#releasedDocTypeDropdown input[type="checkbox"]:checked');
      return Array.from(checkboxes).map(cb => cb.value);
    }

    function applyReleasedFilters() {
      const docTypeFilters = getSelectedReleasedDocTypes();
      const dateFrom = document.getElementById('releasedDateFrom').value;
      const dateTo = document.getElementById('releasedDateTo').value;
      
      const tableBody = document.getElementById('releasedTableBody');
      const rows = tableBody.getElementsByTagName('tr');
      
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const docType = row.cells[2].textContent;
        const date = row.cells[3].textContent;
                
        let showRow = true;
        
        if (docTypeFilters.length > 0 && !docTypeFilters.includes(docType)) {
          showRow = false;
        }
                
        if (dateFrom && date < dateFrom) {
          showRow = false;
        }
        if (dateTo && date > dateTo) {
          showRow = false;
        }
        
        row.style.display = showRow ? '' : 'none';
      }
    }

    function clearReleasedFilters() {
      const docTypeCheckboxes = document.querySelectorAll('#releasedDocTypeDropdown input[type="checkbox"]');
      docTypeCheckboxes.forEach(cb => cb.checked = false);
      document.getElementById('releasedDocTypeDisplay').textContent = 'All Types';
      
      document.getElementById('releasedDateFrom').value = '';
      document.getElementById('releasedDateTo').value = '';
      
      const tableBody = document.getElementById('releasedTableBody');
      const rows = tableBody.getElementsByTagName('tr');
      for (let i = 0; i < rows.length; i++) {
        rows[i].style.display = '';
      }
    }

    function saveReleasedChanges() {
      if (!hasUnsavedReleasedChanges) {
        Swal.fire({
          icon: 'info',
          title: 'No Changes',
          text: 'There are no unsaved changes to save.'
        });
        return;
      }

      Swal.fire({
        title: 'Confirm Save Changes',
        text: 'Are you sure you want to save all changes to released documents?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, save changes',
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if (result.isConfirmed) {
          // Apply any temporary changes (if you add editing functionality later)
          // For now, just reset the changes state
          hasUnsavedReleasedChanges = false;
          updateReleasedChangesState();
          
          Swal.fire({
            icon: 'success',
            title: 'Saved!',
            text: 'All changes to released documents have been saved successfully.',
            timer: 2000,
            timerProgressBar: true
          });
        }
      });
    }

    function updateReleasedChangesState() {
      const saveButton = document.getElementById('releasedSaveButton');
      if (saveButton) {
        if (hasUnsavedReleasedChanges) {
          saveButton.classList.add('has-changes');
          saveButton.textContent = 'Save Changes';
        } else {
          saveButton.classList.remove('has-changes');
          saveButton.textContent = 'Save';
        }
      }
    }
      //update the docsreq table for approved to move
function updateDocumentRequestsTable() {
  const tableBody = document.getElementById('applicantsTableBody');
  const rows = tableBody.getElementsByTagName('tr');

  // Hide rows where status is 'Approved', 'Released', or 'Rejected'
  for (let i = 0; i < rows.length; i++) {
    const applicantIndex = parseInt(rows[i].id.split('-')[1]);
    const applicant = applicantsData[applicantIndex];

    if (applicant && (applicant.status === 'Approved' || applicant.status === 'Released' || applicant.status === 'Rejected')) {
      rows[i].style.display = 'none';
    } else {
      rows[i].style.display = '';
    }
  }
}
// Rejected Documents - Reuse Released Functions
function populateRejectedTable() {
  const rejectedApplicants = applicantsData.filter(app => app.status === 'Rejected');
  const tableBody = document.getElementById('rejectedTableBody');
  tableBody.innerHTML = '';
  
  rejectedApplicants.forEach((applicant, index) => {
    const rejectionDate = applicant.rejectionDate || new Date().toISOString().split('T')[0];
    
    const row = document.createElement('tr');
    const actualIndex = applicantsData.indexOf(applicant);
    row.innerHTML = `
      <td><input type="checkbox" class="checklist resident-checkbox" onchange="toggleRowSelection('rejected', ${actualIndex}, this.checked)"></td>
      <td>${applicant.name}</td>
      <td>${applicant.docType}</td>
      <td>${rejectionDate}</td>
    `;
    tableBody.appendChild(row);
  });
}

function updateRejectedDocTypeFilter() {
  const checkboxes = document.querySelectorAll('#rejectedDocTypeDropdown input[type="checkbox"]');
  const selected = [];
  
  checkboxes.forEach(checkbox => {
    if (checkbox.checked) {
      selected.push(checkbox.value);
    }
  });
  
  const display = document.getElementById('rejectedDocTypeDisplay');
  if (selected.length === 0) {
    display.textContent = 'All Types';
  } else if (selected.length === 1) {
    display.textContent = selected[0];
  } else {
    display.textContent = `${selected.length} types selected`;
  }
  
  applyRejectedFilters();
}

function getSelectedRejectedDocTypes() {
  const checkboxes = document.querySelectorAll('#rejectedDocTypeDropdown input[type="checkbox"]:checked');
  return Array.from(checkboxes).map(cb => cb.value);
}

function applyRejectedFilters() {
  const docTypeFilters = getSelectedRejectedDocTypes();
  const dateFrom = document.getElementById('rejectedDateFrom').value;
  const dateTo = document.getElementById('rejectedDateTo').value;
  
  const tableBody = document.getElementById('rejectedTableBody');
  const rows = tableBody.getElementsByTagName('tr');
  
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const docType = row.cells[1].textContent; // docType is now in column 1
    const date = row.cells[2].textContent;    // date is now in column 2
            
    let showRow = true;
    
    if (docTypeFilters.length > 0 && !docTypeFilters.includes(docType)) {
      showRow = false;
    }
    
    // Filter by date range  
    if (dateFrom && new Date(date) < new Date(dateFrom)) {
      showRow = false;
    }
    if (dateTo && new Date(date) > new Date(dateTo)) {
      showRow = false;
    }
    
    row.style.display = showRow ? '' : 'none';
  }
}

function clearRejectedFilters() {
  const docTypeCheckboxes = document.querySelectorAll('#rejectedDocTypeDropdown input[type="checkbox"]');
  docTypeCheckboxes.forEach(cb => cb.checked = false);
  document.getElementById('rejectedDocTypeDisplay').textContent = 'All Types';
  
  document.getElementById('rejectedDateFrom').value = '';
  document.getElementById('rejectedDateTo').value = '';
  
  const tableBody = document.getElementById('rejectedTableBody');
  const rows = tableBody.getElementsByTagName('tr');
  for (let i = 0; i < rows.length; i++) {
    rows[i].style.display = '';
  }
}

// Dedicated functions for rejected documents
function toggleRejectedSearch() {
  const searchInput = document.getElementById('rejectedSearchInput');
  if (searchInput.style.display === 'block') {
    searchInput.style.display = 'none';
    searchInput.value = '';
    filterRejectedTable('');
  } else {
    searchInput.style.display = 'block';
    searchInput.focus();
  }
}

function filterRejectedTable(searchTerm) {
  const tableBody = document.getElementById('rejectedTableBody');
  const rows = tableBody.getElementsByTagName('tr');
  
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const searchFields = [
      row.cells[0].textContent.toLowerCase(), // name
      row.cells[1].textContent.toLowerCase(), // docType
      row.cells[2].textContent.toLowerCase()  // date
    ];
    
    const searchLower = searchTerm.toLowerCase();
    const shouldShow = searchTerm === '' || searchFields.some(field => field.includes(searchLower));
    
    row.style.display = shouldShow ? '' : 'none';
  }
  
  if (searchTerm === '') {
    applyRejectedFilters();
  }
}

function toggleRejectedFilter() {
  const filterPanel = document.getElementById('rejectedFilterPanel');
  filterPanel.classList.toggle('active');
}

function toggleRejectedDocTypeDropdown() {
  const dropdown = document.getElementById('rejectedDocTypeDropdown');
  const container = dropdown.parentElement;
  dropdown.classList.toggle('active');
  container.classList.toggle('active');
}

function toggleRowSelection(tabType, applicantIndex, isChecked) {
  if (tabType === 'released') {
    if (isChecked) {
      selectedReleasedRows.add(applicantIndex);
    } else {
      selectedReleasedRows.delete(applicantIndex);
    }
  } else if (tabType === 'rejected') {
    if (isChecked) {
      selectedRejectedRows.add(applicantIndex);
    } else {
      selectedRejectedRows.delete(applicantIndex);
    }
  }
}

// Updated password protection for move buttons with styling and toasts
//const MOVE_PASSWORD = "admin123"; // Password for move operations

function showMoveConfirmation(tabType) {
  const selectedRows = tabType === 'released' ? selectedReleasedRows : selectedRejectedRows;
  const buttonId = tabType === 'released' ? 'releasedMoveButton' : (tabType === 'rejected' ? 'rejectedMoveButton' : 'approvedMoveButton');
  const button = document.getElementById(buttonId);
  
  if (selectedRows.size === 0) {
      console.log('About to show warning toast'); // Debug log
    showToast('No applications selected! Please select at least one application to move.', 'warning');
    return;
  }

  // Apply processing style to button
  button.disabled = true;
  button.classList.add('processing');
  button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';

  const targetTab = tabType === 'released' ? 'Document Requests' : 'Document Requests';
  
  // Show password modal instead of SweetAlert
  showMovePasswordModal(tabType, selectedRows.size, targetTab);
}

function showMovePasswordModal(tabType, selectedCount, targetTab) {
  // Create password modal if it doesn't exist
  let modal = document.getElementById('movePasswordModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'movePasswordModal';
    modal.className = 'password-modal';
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h3>Enter Password</h3>
          <button class="modal-close" onclick="cancelMovePassword()">&times;</button>
        </div>
        <div class="modal-body">
          <p id="movePasswordText">You are about to move applications</p>
          <div class="input-group">
            <input type="password" id="movePasswordInput" placeholder="Enter password" autocomplete="off">
            <button class="btn-primary" onclick="confirmMovePassword()">
              <i class="fas fa-arrow-right"></i> Move Applications
            </button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }
  
  // Update modal content
  document.getElementById('movePasswordText').textContent = 
    `You are about to move ${selectedCount} application(s) to ${targetTab}`;
  
  // Store current operation details
  window.currentMoveOperation = { tabType, selectedCount, targetTab };
  
  // Show modal
  modal.style.display = 'flex';
  document.getElementById('movePasswordInput').focus();
}

function confirmMovePassword() {
  const password = document.getElementById('movePasswordInput').value;
  const { tabType, selectedCount, targetTab } = window.currentMoveOperation;
  
  if (password === adminSettings.movePassword) {
    // Hide modal
    document.getElementById('movePasswordModal').style.display = 'none';
    document.getElementById('movePasswordInput').value = '';
    
    // Show success slide toast
    // showToast('Password confirmed! Moving applications...', 'success');
    // const toast = showProgressToast('Moving Applications', `Moving ${selectedCount} application(s) to ${targetTab}...`);
    showProgressToast(
      'Moving Applications',
      `Moving ${selectedCount} application(s) to ${targetTab}...`,
      'Applications Moved',
      `Successfully moved ${selectedCount} application(s) to ${targetTab}`,
    );
    // Proceed with move
        moveSelectedApplications(tabType);
  } else {
    showToast('Incorrect password! Please try again.', 'error');
    document.getElementById('movePasswordInput').value = '';
    document.getElementById('movePasswordInput').focus();
  }
}

function cancelMovePassword() {
  const { tabType } = window.currentMoveOperation || {};
  
  document.getElementById('movePasswordModal').style.display = 'none';
  document.getElementById('movePasswordInput').value = '';
  
  // Reset button if operation was cancelled
  if (tabType) {
    resetMoveButton(tabType);
  }
  
  showToast('Move operation cancelled.', 'info');
}

function resetMoveButton(tabType) {
  const buttonId = tabType === 'released' ? 'releasedMoveButton' : (tabType === 'rejected' ? 'rejectedMoveButton' : 'approvedMoveButton');
  const button = document.getElementById(buttonId);
  const targetText = tabType === 'released' ? 'Move to Requests' : 'Move to Document Requests';
  const icon = tabType === 'released' ? 'fas fa-arrow-right' : (tabType === 'rejected' ? 'fas fa-undo' : 'fas fa-undo');
  
  button.disabled = false;
  button.classList.remove('processing');
  button.innerHTML = `<i class="${icon}"></i> ${targetText}`;
}

function moveSelectedApplications(tabType) {
  const selectedRows = tabType === 'released' ? selectedReleasedRows : (tabType === 'rejected' ? selectedRejectedRows : selectedApprovedRows);
  const targetStatus = tabType === 'released' ? 'Pending' : 'Pending';
  
  // Move applications
  selectedRows.forEach(applicantIndex => {
    const applicant = applicantsData[applicantIndex];
    applicant.status = targetStatus;
    applicant.tempStatus = targetStatus;
    
    // Clear release/rejection specific data
    if (tabType === 'released') {
      delete applicant.releaseDate;
      delete applicant.isReleased;
      delete applicant.tempIsReleased;
    } else if (tabType === 'rejected') {
      delete applicant.rejectionDate;
    }
  });
  
  const selectedCount = selectedRows.size;
  if (tabType === 'released') {
    selectedReleasedRows.clear();
  } else if (tabType === 'rejected') {
    selectedRejectedRows.clear();
  } else {
    selectedApprovedRows.clear();
  }
  
  // Update UI
  updateDashboardCounts();
  updateDocumentRequestsTable();

  if (tabType === 'released') {
    populateReleasedTable();
  } else {
    populateRejectedTable();
  }
  
  saveDataToStorage();
  
  // Reset button
  resetMoveButton(tabType);
  
  const targetTab = tabType === 'released' ? 'Approved' : 'Document Requests';
  // showToast(`${selectedCount} application(s) moved to ${targetTab} successfully!`, 'success', 5000);
}

// Handle Enter key in move password modal
// document.addEventListener('keydown', function(event) {
//   const modal = document.getElementById('movePasswordModal');
//   if (event.key === 'Enter' && modal && modal.style.display === 'flex') {
//     confirmMovePassword();
//   }
// });

// // Handle Escape key to close move password modal
// document.addEventListener('keydown', function(event) {
//   const modal = document.getElementById('movePasswordModal');
//   if (event.key === 'Escape' && modal && modal.style.display === 'flex') {
//     cancelMovePassword();
//   }
// });

document.addEventListener('keydown', function(event) {
  // Existing password modal handling
  if (event.key === 'Enter' && document.getElementById('passwordModal') && document.getElementById('passwordModal').style.display === 'flex') {
    confirmPassword();
  }
  
  if (event.key === 'Escape' && document.getElementById('passwordModal') && document.getElementById('passwordModal').style.display === 'flex') {
    cancelPassword();
  }
  

});


// Fixed voters filter and search functions
function toggleVotersFilter() {
  const panel = document.getElementById('votersFilterPanel');
  if (panel) {
    panel.classList.toggle('active');
  }
}

function toggleVotersSearch() {
  const searchInput = document.getElementById('votersSearchInput');
  if (searchInput) {
    if (searchInput.style.display === 'block') {
      searchInput.style.display = 'none';
      searchInput.value = '';
      populateVotersTable('');
    } else {
      searchInput.style.display = 'block';
      searchInput.focus();
    }
  }
}
// Updated voters filter functions with debugging
function filterVotersTable(searchTerm) {
  console.log('Search term:', searchTerm);
  const tbody = document.getElementById('votersTableBody');
  if (!tbody) {
    console.log('Table body not found');
    return;
  }
  
  const rows = tbody.getElementsByTagName('tr');
  console.log('Total rows:', rows.length);
  
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const cells = row.getElementsByTagName('td');
    
    if (cells.length > 0) {
      // Correct column indices (no checkbox column)
      const name = cells[0] ? cells[0].textContent.toLowerCase() : '';          // Full Name
      const sex = cells[1] ? cells[1].textContent.toLowerCase() : '';           // Sex
      const address = cells[2] ? cells[2].textContent.toLowerCase() : '';       // Complete Address
      const birthday = cells[3] ? cells[3].textContent.toLowerCase() : '';      // Birthday
      const birthplace = cells[4] ? cells[4].textContent.toLowerCase() : '';    // Birthplace
      const age = cells[5] ? cells[5].textContent.toLowerCase() : '';           // Age
      const civilStatus = cells[6] ? cells[6].textContent.toLowerCase() : '';   // Civil Status
      const phone = cells[7] ? cells[7].textContent.toLowerCase() : '';         // Contact Number

      const searchLower = searchTerm.toLowerCase();
      
      if (searchTerm === '' || 
          name.includes(searchLower) || 
          sex.includes(searchLower) || 
          address.includes(searchLower) || 
          birthday.includes(searchLower) || 
          birthplace.includes(searchLower) || 
          age.includes(searchLower) || 
          civilStatus.includes(searchLower) ||
          phone.includes(searchLower)) {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    }
  }
  
  if (searchTerm === '') {
    applyVotersFilters();
  }
}

function applyVotersFilters() {
  console.log('Applying voters filters...');
  const tbody = document.getElementById('votersTableBody');
  if (!tbody) {
    console.log('Table body not found in applyVotersFilters');
    return;
  }
  
  const sexCheckboxes = document.querySelectorAll('#votersFilterPanel input[type="checkbox"][data-filter="sex"]:checked');
  const civilStatusCheckboxes = document.querySelectorAll('#votersFilterPanel input[type="checkbox"][data-filter="civilStatus"]:checked');

  const selectedSex = Array.from(sexCheckboxes).map(cb => cb.value);
  const selectedCivilStatus = Array.from(civilStatusCheckboxes).map(cb => cb.value);
  
  console.log('Selected sex filters:', selectedSex);
  console.log('Selected civil status filters:', selectedCivilStatus);
  
  const ageFrom = document.getElementById('ageFrom') ? document.getElementById('ageFrom').value : '';
  const ageTo = document.getElementById('ageTo') ? document.getElementById('ageTo').value : '';
  
  console.log('Age range:', ageFrom, 'to', ageTo);
  
  const rows = tbody.getElementsByTagName('tr');
  let visibleCount = 0;
  
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const cells = row.getElementsByTagName('td');
    
    if (cells.length > 0) {
      // Correct column indices (no checkbox column)
      const sex = cells[1] ? cells[1].textContent.trim() : '';           // Sex column
      const ageText = cells[5] ? cells[5].textContent.trim() : '';       // Age column
      const age = parseInt(ageText) || 0;
      const civilStatus = cells[6] ? cells[6].textContent.trim() : '';   // Civil Status column
      
      if (i === 0) {
        console.log('First row data:');
        console.log('- Sex value:', `"${sex}"`);
        console.log('- Age value:', `"${ageText}"`, 'parsed:', age);
        console.log('- Civil Status value:', `"${civilStatus}"`);
      }
      
      let showRow = true;
      
      if (selectedSex.length > 0 && !selectedSex.includes(sex)) {
        showRow = false;
      }
      
      if (selectedCivilStatus.length > 0 && !selectedCivilStatus.includes(civilStatus)) {
        showRow = false;
      }
      
      if (ageFrom && age < parseInt(ageFrom)) {
        showRow = false;
      }
      
      if (ageTo && age > parseInt(ageTo)) {
        showRow = false;
      }
      
      row.style.display = showRow ? '' : 'none';
      if (showRow) visibleCount++;
    }
  }
  
  console.log('Visible rows after filtering:', visibleCount);
}

function updateVotersSexFilter() {
  applyVotersFilters();
}

function updateVoterssCivilStatusFilter() {
  applyVotersFilters();
}

function clearVotersFilters() {
  console.log('Clearing voters filters...');
  
  const checkboxes = document.querySelectorAll('#votersFilterPanel input[type="checkbox"]');
  checkboxes.forEach(cb => cb.checked = false);
  
  const ageFromInput = document.getElementById('ageFrom');
  const ageToInput = document.getElementById('ageTo');
  if (ageFromInput) ageFromInput.value = '';
  if (ageToInput) ageToInput.value = '';
  
  const searchInput = document.getElementById('votersSearchInput');
  if (searchInput) searchInput.value = '';
  
  const tbody = document.getElementById('votersTableBody');
  if (tbody) {
    const rows = tbody.getElementsByTagName('tr');
    for (let i = 0; i < rows.length; i++) {
      rows[i].style.display = '';
    }
    console.log('All rows shown, total:', rows.length);
  }
}

// Function to toggle residents filter panel
function toggleVotersFilter() {
  const filterPanel = document.getElementById('votersFilterPanel');
  if (filterPanel) {
    filterPanel.classList.toggle('active');
    console.log('Filter panel toggled, active:', filterPanel.classList.contains('active'));
  } else {
    console.log('voters filter panel not found');
  }
}



// Close filter panel when clicking outside
document.addEventListener('click', function(event) {
  const filterPanel = document.getElementById('votersFilterPanel');
  const filterButton = document.querySelector('[onclick="toggleVotersFilter()"]');
  
  if (filterPanel && filterButton && 
      !filterPanel.contains(event.target) && 
      !filterButton.contains(event.target)) {
    filterPanel.classList.remove('active');
  }
});
// Close filter panel when clicking outside
document.addEventListener('click', function(event) {
  const filterPanel = document.getElementById('filterPanel');
  const filterButton = document.querySelector('[onclick="toggleFilter()"]');
  
  if (filterPanel && filterButton && 
      !filterPanel.contains(event.target) && 
      !filterButton.contains(event.target)) {
    filterPanel.classList.remove('active');
  }
});
// Close filter panel when clicking outside
document.addEventListener('click', function(event) {
  const filterPanel = document.getElementById('rejectedFilterPanel');
  const filterButton = document.querySelector('[onclick="toggleRejectedFilter()"]');
  
  if (filterPanel && filterButton && 
      !filterPanel.contains(event.target) && 
      !filterButton.contains(event.target)) {
    filterPanel.classList.remove('active');
  }
});
// Close filter panel when clicking outside
document.addEventListener('click', function(event) {
  const filterPanel = document.getElementById('releasedFilterPanel');
  const filterButton = document.querySelector('[onclick="toggleReleasedFilter()"]');
  
  if (filterPanel && filterButton && 
      !filterPanel.contains(event.target) && 
      !filterButton.contains(event.target)) {
    filterPanel.classList.remove('active');
  }
});
document.addEventListener('click', function(event) {
  const filterPanel = document.getElementById('approvedFilterPanel');
  const filterButton = document.querySelector('[onclick="toggleApprovedFilter()"]');
  
  if (filterPanel && filterButton && 
      !filterPanel.contains(event.target) && 
      !filterButton.contains(event.target)) {
    filterPanel.classList.remove('active');
  }
});



function populateVotersTable() {
  const tbody = document.getElementById('votersTableBody');
  if (!tbody) {
    console.log('Table body not found');
    return;
  }
  
  // Clear existing content
  tbody.innerHTML = '';
  
  // Add each resident as a row
  votersData.forEach((resident, index) => {
    const row = document.createElement('tr');
    
    row.innerHTML = `
      <td>${resident.fullName}</td>
      <td>${resident.sex}</td>
      <td>${resident.address}</td>
      <td>${resident.birthday}</td>
      <td>${resident.birthplace}</td>
      <td>${resident.age}</td>
      <td>${resident.civilStatus}</td>
      <td>${resident.contactNumber}</td>
    `;
    
    tbody.appendChild(row);
  });
  
  console.log('Table populated with', votersData.length, 'voters');
}


// =========== Admin Settings Functions
function showAdminLogin() {
    document.getElementById('adminPasswordModal').style.display = 'flex';
    document.getElementById('adminPasswordInput').focus();
}

function confirmAdminPassword() {
    const password = document.getElementById('adminPasswordInput').value;
    if (password === adminSettings.loginPassword) {
        isAdminAccessGranted = true;
        document.getElementById('adminPasswordModal').style.display = 'none';
        document.getElementById('adminPasswordInput').value = '';
        
        // Show the admin section and load settings
        document.getElementById('adminSettings').style.display = 'block';
        loadAdminSettings();
        // showToast('Admin access granted!', 'success');
    showProgressToast(
  'Verifying',
  'Please wait...',
  'Access granted!',
  'Welcome to Admin Management.',
);
    } else {
        showToast('Incorrect admin password!', 'error');
        document.getElementById('adminPasswordInput').value = '';
        document.getElementById('adminPasswordInput').focus();
    }
}



function cancelAdminPassword() {
    document.getElementById('adminPasswordModal').style.display = 'none';
    document.getElementById('adminPasswordInput').value = '';
    
    // Return to dashboard since access was denied
    showSection('dashboard');
    showToast('Admin access cancelled. Returning to dashboard.', 'info');
}

function showForgotPasswordModal(passwordType) {
    const modal = document.getElementById('forgotPasswordModal');
    const typeSpan = document.getElementById('forgotPasswordType');
    
    // Set the password type in the modal
    typeSpan.textContent = passwordType;
    modal.setAttribute('data-password-type', passwordType);
    modal.style.display = 'flex';
    
    document.getElementById('recoveryEmail').focus();
}
// forgot pass
function processForgotPassword() {
    const email = document.getElementById('recoveryEmail').value.trim();
    const passwordType = document.getElementById('forgotPasswordModal').getAttribute('data-password-type');
    
    if (!email) {
        showToast('Please enter your recovery email!', 'error');
        return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showToast('Please enter a valid email address!', 'error');
        return;
    }
    
    // In a real application, this would send an email with recovery instructions
    showToast(`Recovery instructions for ${passwordType} sent to ${email}!`, 'success');
    console.log(`Password recovery initiated for ${passwordType} at email: ${email}`);
    
    // Close modal and clear field
    closeForgotPasswordModal();
}

function closeForgotPasswordModal() {
    document.getElementById('forgotPasswordModal').style.display = 'none';
    document.getElementById('recoveryEmail').value = '';
}

function validatePasswordChange(currentPassword, newPassword, confirmPassword) {
    if (!currentPassword) {
        showToast('Please enter your current password!', 'error');
        return false;
    }
    
    if (!newPassword) {
        showToast('Please enter a new password!', 'error');
        return false;
    }
    
    if (newPassword !== confirmPassword) {
        showToast('New passwords do not match!', 'error');
        return false;
    }
    
    if (newPassword.length < 6) {
        showToast('Password must be at least 6 characters long!', 'error');
        return false;
    }
    
    return true;
}

function changeSpecificPassword(passwordType) {
    const currentPassword = document.getElementById(`current${passwordType}Password`).value;
    const newPassword = document.getElementById(`new${passwordType}Password`).value;
    const confirmPassword = document.getElementById(`confirm${passwordType}Password`).value;
    
    let actualCurrentPassword;
    switch(passwordType) {
        case 'Admin':
            actualCurrentPassword = adminSettings.loginPassword;
            break;
        case 'Move':
            actualCurrentPassword = adminSettings.movePassword;
            break;
        case 'Edit':
            actualCurrentPassword = adminSettings.editPassword;
            break;
        default:
            showToast('Invalid password type!', 'error');
            return;
    }
    
    if (currentPassword !== actualCurrentPassword) {
        showToast(`Current ${passwordType.toLowerCase()} password is incorrect!`, 'error');
        return;
    }
    
    if (!validatePasswordChange(currentPassword, newPassword, confirmPassword)) {
        return;
    }
    
    // Update the password
    switch(passwordType) {
        case 'Admin':
            adminSettings.loginPassword = newPassword;
            break;
        case 'Move':
            adminSettings.movePassword = newPassword;
            break;
        case 'Edit':
            adminSettings.editPassword = newPassword;
            break;
    }
    
    // Save to localStorage
    localStorage.setItem('adminSettings', JSON.stringify(adminSettings));
    
    // Clear all password fields
    document.getElementById(`current${passwordType}Password`).value = '';
    document.getElementById(`new${passwordType}Password`).value = '';
    document.getElementById(`confirm${passwordType}Password`).value = '';
    
    // showToast(`${passwordType} password changed successfully!`, 'success');
        showProgressToast(
  'Signing in',
  'Please wait...',
  '`${passwordType} password changed successfully!'
);
}
function showTab(tabName) {
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active class from all nav tabs
    document.querySelectorAll('.nav-tab').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab and activate button
    document.getElementById(tabName).classList.add('active');
    event.target.classList.add('active');
}
// Render the requirements list
// Initialize requirements system
document.addEventListener('DOMContentLoaded', function() {
    loadSavedRequirements();
});

function loadRequirementsForDocType() {
    const docTypeSelect = document.getElementById('requirementDocType');
    const requirementsContainer = document.getElementById('requirementsContainer');
    const selectedDocTypeName = document.getElementById('selectedDocTypeName');
    
    currentDocTypeForRequirements = docTypeSelect.value;
    
    if (currentDocTypeForRequirements) {
        selectedDocTypeName.textContent = currentDocTypeForRequirements;
        requirementsContainer.style.display = 'block';
        renderRequirementsList();
    } else {
        requirementsContainer.style.display = 'none';
    }
}
function loadExistingRequirements(docType) {
    // Set the current document type
    currentDocTypeForRequirements = docType;
    
    // Initialize empty array if document type doesn't exist
    if (!documentRequirements[docType]) {
        documentRequirements[docType] = [];
    }
    
    // Render the requirements
    renderRequirementsList();
}


function renderRequirementsList() {
    const requirementsList = document.getElementById('requirementsList');
    const requirements = documentRequirements[currentDocTypeForRequirements] || [];
    
    if (requirements.length === 0) {
        requirementsList.innerHTML = `
            <div class="empty-requirements">
                <i class="fas fa-clipboard-list" style="font-size: 48px; margin-bottom: 15px; opacity: 0.3;"></i>
                <p>No requirements set for this document type.</p>
                <p>Click "Add Requirement" to get started.</p>
            </div>
        `;
        return;
    }
    
    requirementsList.innerHTML = requirements.map((req, index) => `
        <div class="requirement-item" data-index="${index}" draggable="true">
            <div class="drag-handle" title="Drag to reorder">
                <i class="fas fa-grip-vertical"></i>
            </div>
            <div class="requirement-order">${index + 1}</div>
            <input type="text" 
                   class="requirement-input" 
                   value="${req || ''}" 
                   onchange="updateRequirement(${index}, this.value)"
                   oninput="updateRequirement(${index}, this.value)"
                   placeholder="Enter requirement description..."
                   ${req === '' ? 'data-new="true"' : ''}>
            <div class="requirement-controls">
                <button type="button" 
                        class="btn-remove-requirement" 
                        onclick="removeRequirement(${index})" 
                        title="Remove requirement">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
    
    // Add drag and drop functionality
    addDragAndDropToRequirements();
    
    // Highlight newly added (empty) requirements
    const newInputs = requirementsList.querySelectorAll('input[data-new="true"]');
    newInputs.forEach(input => {
        const requirementItem = input.closest('.requirement-item');
        requirementItem.classList.add('newly-added');
        
        // Remove highlight after animation completes
        setTimeout(() => {
            requirementItem.classList.remove('newly-added');
        }, 2000);
    });
    
    // Show preview
    showRequirementsPreview();
}

// Add drag and drop functionality
function addDragAndDropToRequirements() {
    const requirementItems = document.querySelectorAll('.requirement-item');
    
    requirementItems.forEach(item => {
        item.addEventListener('dragstart', handleDragStart);
        item.addEventListener('dragover', handleDragOver);
        item.addEventListener('drop', handleDrop);
        item.addEventListener('dragenter', handleDragEnter);
        item.addEventListener('dragleave', handleDragLeave);
    });
}

let draggedElement = null;

function handleDragStart(e) {
    draggedElement = this;
    this.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
}

function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
}

function handleDragEnter(e) {
    this.style.borderTop = '3px solid #007bff';
}

function handleDragLeave(e) {
    this.style.borderTop = '';
}

function handleDrop(e) {
    e.preventDefault();
    this.style.borderTop = '';
    
    if (draggedElement !== this) {
        const requirements = documentRequirements[currentDocTypeForRequirements];
        const draggedIndex = parseInt(draggedElement.dataset.index);
        const targetIndex = parseInt(this.dataset.index);
        
        // Reorder the requirements array
        const draggedItem = requirements.splice(draggedIndex, 1)[0];
        requirements.splice(targetIndex, 0, draggedItem);
        
        requirementsChanged = true;
        renderRequirementsList();
        showToast('Requirements reordered. Don\'t forget to save!', 'info');
    }
    
    draggedElement.classList.remove('dragging');
    draggedElement = null;
}

// Add new requirement
function addRequirementAtPosition(position = 0, value = '') {
    if (!currentDocTypeForRequirements) {
        alert('Please select a document type first.');
        return;
    }
    
    // Initialize requirements array if it doesn't exist
    if (!documentRequirements[currentDocTypeForRequirements]) {
        documentRequirements[currentDocTypeForRequirements] = [];
    }
    
    // Insert at specified position
    documentRequirements[currentDocTypeForRequirements].splice(position, 0, value);
    
    // Re-render the list
    renderRequirementsList();
    
    // Focus on the input at the specified position
    setTimeout(() => {
        const inputs = document.querySelectorAll('.requirement-input');
        if (inputs[position]) {
            inputs[position].focus();
            if (value === '') {
                inputs[position].select();
            }
        }
    }, 100);
}
// function addNewRequirement() {
//     const requirementsList = document.getElementById('requirementsList');
//     const requirementItem = document.createElement('div');
//     requirementItem.className = 'requirement-item';
//     requirementItem.innerHTML = `
//         <input type="text" placeholder="Enter requirement description" class="requirement-input">
//         <button type="button" onclick="removeRequirement(this)" class="btn-remove-requirement">
//             <i class="fas fa-trash"></i>
//         </button>
//     `;
//     requirementsList.appendChild(requirementItem);
// }

// Update requirement text
function updateRequirement(index, value) {
    if (!currentDocTypeForRequirements) return;
    
    documentRequirements[currentDocTypeForRequirements][index] = value.trim();
    requirementsChanged = true;
    showRequirementsPreview();
}

// Remove requirement
function removeRequirement(index) {
    if (!currentDocTypeForRequirements) return;
    
    const requirements = documentRequirements[currentDocTypeForRequirements];
    const requirementText = requirements[index];
    
    showConfirmationModal(
        'Remove Requirement?',
        `Are you sure you want to remove "${requirementText}"? This action cannot be undone.`,
        'Yes, remove it',
        'Cancel',
        () => {
            requirements.splice(index, 1);
            requirementsChanged = true;
            renderRequirementsList();
              showProgressToast(
                'Saving Changes',
                'Please wait...',
                'Settings saved successfully!'
              );
        }
    );
}

// Show requirements preview
function showRequirementsPreview() {
    const requirementsList = document.getElementById('requirementsList');
    let existingPreview = requirementsList.querySelector('.requirements-preview');
    
    if (existingPreview) {
        existingPreview.remove();
    }
    
    const requirements = documentRequirements[currentDocTypeForRequirements] || [];
    
    if (requirements.length > 0) {
        const preview = document.createElement('div');
        preview.className = 'requirements-preview';
        preview.innerHTML = `
            <h5><i class="fas fa-eye"></i> Preview - How this will appear in the modal:</h5>
            <ul>
                ${requirements.map(req => `<li>${req}</li>`).join('')}
            </ul>
        `;
        requirementsList.appendChild(preview);
    }
}

// Save requirements
function saveRequirements() {
    if (!currentDocTypeForRequirements) return;
    
    // Validate requirements (remove empty ones)
    const requirements = documentRequirements[currentDocTypeForRequirements];
    const validRequirements = requirements.filter(req => req.trim() !== '');
    documentRequirements[currentDocTypeForRequirements] = validRequirements;
    
    // Save to localStorage (or your preferred storage method)
    try {
        localStorage.setItem('documentRequirements', JSON.stringify(documentRequirements));
        requirementsChanged = false;
        
        showProgressToast(
          'Saving Changes',           // Progress title
          'Please wait...',           // Progress subtitle  
          'Changes Saved',            // Success title
          'All changes have been saved successfully'  // Success subtitle
        );
        renderRequirementsList();
    } catch (error) {
        console.error('Error saving requirements:', error);
        showToast('Error saving requirements. Please try again.', 'error');
    }
}

// Reset requirements to default
function resetRequirements() {
    if (!currentDocTypeForRequirements) return;
    
    Swal.fire({
        title: 'Reset Requirements?',
        text: 'This will restore the default requirements for this document type. Any custom changes will be lost.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#007bff',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Reset to Default',
        cancelButtonText: 'Cancel'
    }).then((result) => {
        if (result.isConfirmed) {
            // Reset to default requirements (you can customize these defaults)
            const defaultRequirements = {
                'Barangay Clearance': ['Valid ID', 'Proof of Residency', 'Application Form', 'Payment Receipt'],
                'Certificate of Indigency': ['Valid ID', 'Birth Certificate', 'Application Form'],
                'Business Permit': ['DTI Registration', 'BIR Certificate', 'Valid ID', 'Business Plan'],
                'Barangay ID': ['Birth Certificate', '2 pcs 1x1 ID Picture', 'Application Form'],
                'Certificate of Residency': ['Valid ID', 'Birth Certificate', 'Proof of Address']
            };
            
            documentRequirements[currentDocTypeForRequirements] = [...defaultRequirements[currentDocTypeForRequirements]];
            requirementsChanged = true;
            renderRequirementsList();
            // showToast('Requirements reset to default', 'success');
              showProgressToast(
                'Saving Changes',
                'Please wait...',
                'Requirements reset to default'
              );

        }
    });
}

// Load saved requirements on page load
function loadSavedRequirements() {
    try {
        const saved = localStorage.getItem('documentRequirements');
        if (saved) {
            const savedRequirements = JSON.parse(saved);
            // Merge saved requirements with defaults
            Object.keys(savedRequirements).forEach(docType => {
                if (documentRequirements[docType]) {
                    documentRequirements[docType] = savedRequirements[docType];
                }
            });
        }
    } catch (error) {
        console.error('Error loading saved requirements:', error);
    }
}

// Get requirements for a specific document type (used by other parts of the system)
function getRequirementsForDocType(docType) {
    return documentRequirements[docType] || [];
}

// Update the existing showApplicantModal function to use dynamic requirements
function updateApplicantModalWithDynamicRequirements(index, name, age, address,birthplace,civilStatus,requestedBy,placeIssued,dateIssued, docType, status, purpose,ctcnum, requirements) {
    // Get dynamic requirements instead of using hardcoded ones
    const dynamicRequirements = getRequirementsForDocType(docType);
    
    // Use dynamic requirements if available, otherwise fall back to provided requirements
    const finalRequirements = dynamicRequirements.length > 0 ? dynamicRequirements : requirements;
    
    // Call the original function with updated requirements
    showApplicantModal(index, name, age, address,birthplace,civilStatus,requestedBy,placeIssued,dateIssued, docType, status, purpose, ctcnum, finalRequirements);
}

function loadAdminSettings() {
    // Load current settings into form fields
    document.getElementById('loginUsername').value = adminSettings.loginUsername;
    document.getElementById('loginPassword').value = adminSettings.loginPassword;
    
    document.getElementById('movePassword').value = adminSettings.movePassword;
    document.getElementById('editPassword').value = adminSettings.editPassword;
    document.getElementById('releaseDuration').value = adminSettings.releaseArchiveDuration;
    document.getElementById('backupSchedule').value = adminSettings.backupSchedule;

    // NEW: Clear current password field for security
    document.getElementById('currentAdminPassword').value = '';

    // Load document types
    loadDocumentTypes();
}

function showSaveSettingsModal() {
    document.getElementById('saveSettingsModal').style.display = 'block';
    document.getElementById('saveSettingsPasswordInput').focus();
}

function cancelSaveSettings() {
    document.getElementById('saveSettingsModal').style.display = 'none';
    document.getElementById('saveSettingsPasswordInput').value = '';
}

function confirmSaveSettings() {
    const password = document.getElementById('saveSettingsPasswordInput').value;
    
    if (!password) {
        showToast('Please enter your admin password', 'error');
        return;
    }
    
    // Call your existing saveAdminSettings function with the password
    const saveResult = saveAdminSettings(password);
    
    // Show success toast if save was successful
    if (saveResult !== false) {
        // showToast('Settings saved successfully!', 'success');
              showProgressToast(
                'Saving Changes',
                'Please wait...',
                'Settings saved successfully!'
              );
        
        // Close modal and clear input after short delay
        setTimeout(() => {
            document.getElementById('saveSettingsModal').style.display = 'none';
            document.getElementById('saveSettingsPasswordInput').value = '';
        }, 1000);
    }
}

function saveAdminSettings(adminPassword) {
    // Verify admin password
    if (!adminPassword) {
        showToast('Admin password is required', 'error');
        return false;
    }
    
    const storedPassword = adminSettings.loginPassword;
    if (adminPassword !== storedPassword) {
        showToast('Incorrect admin password', 'error');
        return false;
    }

    try {
        // Save all settings
        adminSettings.loginUsername = document.getElementById('loginUsername').value;
        adminSettings.loginPassword = document.getElementById('loginPassword').value;
      
        adminSettings.movePassword = document.getElementById('movePassword').value;
        adminSettings.editPassword = document.getElementById('editPassword').value;
        adminSettings.releaseArchiveDuration = parseInt(document.getElementById('releaseDuration').value);
        adminSettings.backupSchedule = document.getElementById('backupSchedule').value;
        sessionTimeout = parseInt(document.getElementById('sessionTimeout').value);
        warningTime = parseInt(document.getElementById('warningTime').value);
        enableSessionWarning = document.getElementById('enableSessionWarning').checked;

        // Save to localStorage
        localStorage.setItem('adminSettings', JSON.stringify(adminSettings));
        localStorage.setItem('sessionTimeout', sessionTimeout);
        localStorage.setItem('warningTime', warningTime);
        localStorage.setItem('enableSessionWarning', enableSessionWarning);

        // Restart session timer with new settings
        resetSessionTimer();

        // Restart backup schedule if changed
        setupBackupSchedule();

        // Return true to indicate success
        return true;

    } catch (error) {
        showToast('Failed to save settings: ' + error.message, 'error');
        return false;
    }
}
function saveAllSettings() {
    // Save all form data
    const settings = {
        loginUsername: document.getElementById('loginUsername').value,
        sessionTimeout: document.getElementById('sessionTimeout').value,
        releaseDuration: document.getElementById('releaseDuration').value,
        backupSchedule: document.getElementById('backupSchedule').value
    };
    
    showNotification('All settings saved successfully!', 'success');
}

// function loadDocumentTypes() {
//     const container = document.getElementById('documentTypesList');
//     container.innerHTML = '';
    
//     adminSettings.documentTypes.forEach((type, index) => {
//         const div = document.createElement('div');
//         div.className = 'document-type-item';
//         div.innerHTML = `
//             <input type="text" value="${type}" onchange="updateDocumentType(${index}, this.value)">
//             <button onclick="removeDocumentType(${index})" class="btn-danger">Remove</button>
//         `;
//         container.appendChild(div);
//     });
// }

// function addDocumentType() {
//     const newType = document.getElementById('newDocumentType').value.trim();
//     if (newType && !adminSettings.documentTypes.includes(newType)) {
//         adminSettings.documentTypes.push(newType);
//         document.getElementById('newDocumentType').value = '';
//         loadDocumentTypes();
//         showToast('Document type added!', 'success');
//     }
// }

// function updateDocumentType(index, newValue) {
//     adminSettings.documentTypes[index] = newValue;
// }

// function removeDocumentType(index) {
//     adminSettings.documentTypes.splice(index, 1);
//     loadDocumentTypes();
//     showToast('Document type removed!', 'info');
// }

function performManualBackup() {
    // Create backup data
    const backupData = {
        timestamp: new Date().toISOString(),
        settings: getSystemSettings(),
        data: 'System backup created successfully'
    };
    
    downloadJSON(backupData, `backup_${new Date().toISOString().split('T')[0]}.json`);
    showNotification('Manual backup created successfully!', 'success');
}

function exportDatabase() {
    const data = {
        exported: new Date().toISOString(),
        records: 'Database exported successfully'
    };
    downloadJSON(data, `database_export_${Date.now()}.json`);
    showNotification('Database exported successfully!', 'success');
}

function importDatabase(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const data = JSON.parse(e.target.result);
                showNotification('Database imported successfully!', 'success');
            } catch (error) {
                showNotification('Error importing database!', 'error');
            }
        };
        reader.readAsText(file);
    }
}

function setupBackupSchedule() {
    if (backupInterval) clearInterval(backupInterval);
    
    if (adminSettings.backupSchedule === 'daily') {
        backupInterval = setInterval(performManualBackup, 24 * 60 * 60 * 1000);
    } else if (adminSettings.backupSchedule === 'weekly') {
        backupInterval = setInterval(performManualBackup, 7 * 24 * 60 * 60 * 1000);
    }
}

function showLogoutConfirmation() {
    showConfirmationModal(
        'Confirm Logout',
        'Are you sure you want to logout? Any unsaved changes will be lost.',
        'Logout',
        'Cancel',
        () => {
            // Show logout toast and perform logout
              showProgressToast(
                'Logging Out',
                'Please wait...',
                'Bye!'
              );
            // Call the actual logout function after a brief delay
            setTimeout(() => {
                logoutAdmin();
            }, 500);
        }
    );
}

// Function to show logout toast
function showLogoutToast() {
    // Create toast container
    const toast = document.createElement('div');
    toast.className = 'logout-toast';
    toast.innerHTML = `
        <div class="logout-toast-content">
            <div class="logout-toast-icon">
                <div class="logout-spinner"></div>
            </div>
            <div class="logout-toast-message">
                <div class="logout-toast-title">Logging Out</div>
                <div class="logout-toast-subtitle">Signing you out securely...</div>
            </div>
        </div>
    `;
    
    // Add toast CSS if not already present
    if (!document.querySelector('#logout-toast-css')) {
        const toastStyle = document.createElement('style');
        toastStyle.id = 'logout-toast-css';
        toastStyle.textContent = `
            .logout-toast {
                position: fixed;
                top: 20px;
                right: 20px;
                background: linear-gradient(135deg, #fff5f5 0%, #fef2f2 100%);
                border-radius: 12px;
                box-shadow: 
                    0 10px 25px rgba(220, 38, 38, 0.15),
                    0 0 0 1px rgba(220, 38, 38, 0.1),
                    inset 0 1px 0 rgba(255, 255, 255, 0.8);
                padding: 16px 20px;
                z-index: 1001;
                min-width: 280px;
                animation: slideInRight 0.4s ease-out;
                border-left: 4px solid #dc2626;
            }
            
            .logout-toast-content {
                display: flex;
                align-items: center;
                gap: 12px;
            }
            
            .logout-toast-icon {
                flex-shrink: 0;
            }
            
            .logout-spinner {
                width: 20px;
                height: 20px;
                border: 2px solid rgba(220, 38, 38, 0.2);
                border-top: 2px solid #dc2626;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }
            
            .logout-toast-message {
                flex: 1;
            }
            
            .logout-toast-title {
                font-weight: 600;
                font-size: 14px;
                color: #dc2626;
                margin-bottom: 2px;
            }
            
            .logout-toast-subtitle {
                font-size: 12px;
                color: #991b1b;
            }
            
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(toastStyle);
    }
    
    // Add toast to body
    document.body.appendChild(toast);
    
    // Remove toast after logout process
    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.4s ease-out';
        setTimeout(() => {
            if (document.body.contains(toast)) {
                document.body.removeChild(toast);
            }
        }, 400);
    }, 2000);
}

// Your existing logout function (keep as is)
function logoutAdmin() {
    // Your existing logout logic here
    // console.log('Admin logged out');
    // Example: redirect to login page
     window.location.href = '../Log-In_and_Reg/adminLogIn.html';
}


function initiateAccountRecovery() {
    showForgotPasswordModal('Admin Account');
}


window.addEventListener('load', resetAccessStates);

// Session Management Functions
function initializeSessionTimer() {
    const savedTimeout = localStorage.getItem('sessionTimeout');
    const savedWarningTime = localStorage.getItem('warningTime');
    const savedWarningEnabled = localStorage.getItem('enableSessionWarning');
    
    if (savedTimeout) sessionTimeout = parseInt(savedTimeout);
    if (savedWarningTime) warningTime = parseInt(savedWarningTime);
    if (savedWarningEnabled !== null) enableSessionWarning = savedWarningEnabled === 'true';
    
    // Update UI elements
    document.getElementById('sessionTimeout').value = sessionTimeout;
    document.getElementById('warningTime').value = warningTime;
    document.getElementById('enableSessionWarning').checked = enableSessionWarning;
    
    resetSessionTimer();
    setupActivityListeners();
    updateSessionIndicator();
}

function setupActivityListeners() {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    events.forEach(event => {
        document.addEventListener(event, () => {
            updateLastActivity();
        }, true);
    });
}

function updateLastActivity() {
    lastActivity = Date.now();
    if (!isWarningShown) {
        resetSessionTimer();
        updateSessionIndicator();
    }
}

function resetSessionTimer() {
    clearTimeout(sessionTimer);
    clearTimeout(warningTimer);
    clearTimeout(warningCountdownTimer);
    
    if (sessionTimeout === 0) return; // Disabled
    
    const timeoutMs = sessionTimeout * 60 * 1000;
    const warningMs = (sessionTimeout - warningTime) * 60 * 1000;
    
    if (enableSessionWarning && warningTime < sessionTimeout) {
        warningTimer = setTimeout(showSessionWarning, warningMs);
    }
    
    sessionTimer = setTimeout(forceLogout, timeoutMs);
    isWarningShown = false;
    hideSessionWarning();
}

function showSessionWarning() {
    if (!enableSessionWarning) return;
    
    isWarningShown = true;
    document.getElementById('sessionWarningModal').style.display = 'block';
    
    let timeLeft = warningTime * 60; // Convert to seconds
    
    const updateCountdown = () => {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        document.getElementById('warningCountdown').textContent = 
            `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        if (timeLeft <= 0) {
            forceLogout();
            return;
        }
        
        timeLeft--;
    };
    
    updateCountdown();
    warningCountdownTimer = setInterval(updateCountdown, 1000);
}

function hideSessionWarning() {
    document.getElementById('sessionWarningModal').style.display = 'none';
    clearInterval(warningCountdownTimer);
}

function extendSession() {
    hideSessionWarning();
    resetSessionTimer();
    updateSessionIndicator();
    showToast('Session extended successfully', 'success');
}

function logoutNow() {
    forceLogout();
}

function forceLogout() {
    clearTimeout(sessionTimer);
    clearTimeout(warningTimer);
    clearTimeout(warningCountdownTimer);
    hideSessionWarning();
    
    showToast('Session expired. Logging out...', 'warning');
    
    setTimeout(() => {
        // Clear any stored login state
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('loginTime');
        
        // Redirect to login page or reload
        window.location.reload();
    }, 2000);
}

function updateSessionIndicator() {
    const indicator = document.getElementById('sessionStatusIndicator');
    const timeLeftSpan = document.getElementById('sessionTimeLeft');
    
    if (sessionTimeout === 0) {
        indicator.style.display = 'none';
        return;
    }
    
    const elapsed = Date.now() - lastActivity;
    const remaining = (sessionTimeout * 60 * 1000) - elapsed;
    
    if (remaining <= 0) {
        indicator.style.display = 'none';
        return;
    }
    
    const minutes = Math.floor(remaining / (1000 * 60));
    const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
    
    timeLeftSpan.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    
    // Show indicator only when time is running low
    if (remaining <= (warningTime + 2) * 60 * 1000) {
        indicator.style.display = 'block';
        indicator.style.background = remaining <= warningTime * 60 * 1000 ? 
            'rgba(255, 107, 53, 0.9)' : 'rgba(255, 193, 7, 0.9)';
    } else {
        indicator.style.display = 'none';
    }
}

// Update session indicator every 30 seconds
setInterval(updateSessionIndicator, 30000);

// ADD this to initialize session timer when page loads
document.addEventListener('DOMContentLoaded', function() {
    // ... existing DOMContentLoaded code ...
    
    // Initialize session timer
    initializeSessionTimer();
});

// ADD these event listeners for session timeout settings
document.getElementById('sessionTimeout').addEventListener('change', function() {
    sessionTimeout = parseInt(this.value);
    resetSessionTimer();
    updateSessionIndicator();
});

document.getElementById('warningTime').addEventListener('change', function() {
    warningTime = parseInt(this.value);
    if (warningTime >= sessionTimeout && sessionTimeout > 0) {
        this.value = Math.max(1, sessionTimeout - 1);
        warningTime = parseInt(this.value);
        showToast('Warning time cannot be greater than or equal to session timeout', 'warning');
    }
});

document.getElementById('enableSessionWarning').addEventListener('change', function() {
    enableSessionWarning = this.checked;
    if (!enableSessionWarning) {
        hideSessionWarning();
    }
});

// Data persistence functions
function saveVotersToStorage() {
  localStorage.setItem('votersData', JSON.stringify(votersData));
}

function loadVotersFromStorage() {
  const savedData = localStorage.getItem('votersData');
  if (savedData) {
    votersData = JSON.parse(savedData);
  }
}

function saveDataToStorage() {
  localStorage.setItem('applicantsData', JSON.stringify(applicantsData));
}

function loadDataFromStorage() {
  const savedData = localStorage.getItem('applicantsData');
  if (savedData) {
    applicantsData = JSON.parse(savedData);
    
    // Clean up inconsistent states on load
    // Initialize temp states if they don't exist
    applicantsData.forEach(applicant => {
      if (applicant.tempStatus === undefined) {
        applicant.tempStatus = applicant.status;
      }
      if (applicant.tempIsReleased === undefined && applicant.isReleased !== undefined) {
        applicant.tempIsReleased = applicant.isReleased;
      }
    });
  }

    loadVotersFromStorage();
}
syncApplicantChecklists();
