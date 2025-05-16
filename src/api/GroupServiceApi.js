import axios from 'axios';

const GROUP_BASE = 'http://localhost:8123/api/group';



// -----------------------------
// 📁 StudyGroup
// -----------------------------
export const createStudyGroup = (data) =>
    axios.post(`${GROUP_BASE}/study-groups`, data);

export const getStudyGroupById = (id) =>
    axios.get(`${GROUP_BASE}/study-groups/${id}`);

export const getStudyGroupsPaged = (page = 0, size = 10) =>
    axios.get(`${GROUP_BASE}/study-groups/paged`, {
        params: { page, size },
    });

export const updateStudyGroup = (id, group, userId) =>
    axios.put(`${GROUP_BASE}/study-groups/${id}`, group, {
        params: { userId },
    });

export const deleteStudyGroup = (id, userId) =>
    axios.delete(`${GROUP_BASE}/study-groups/${id}`, {
        params: { userId },
    });

export const closeStudyGroup = (id) =>
    axios.put(`${GROUP_BASE}/study-groups/${id}/close`);

export const getManagedGroups = (email, page = 0, size = 10) =>
    axios.get(`${GROUP_BASE}/study-groups/managed`, {
        params: { email, page, size },
    });

export const getJoinedGroups = (email, page = 0, size = 10) =>
    axios.get(`${GROUP_BASE}/study-groups/joined`, {
        params: { email, page, size },
    });

// 📁 StudyGroup 목록 전체 조회 (페이징)
export const getAllStudyGroupsPaged = (page = 0, size = 100) =>
    axios.get(`${GROUP_BASE}/study-groups/paged`, {
        params: { page, size }
    });


// -----------------------------
// 📁 StudyDetail
// -----------------------------
export const getStudyDetail = (studyId) =>
    axios.get(`${GROUP_BASE}/study-details/${studyId}`);

// -----------------------------
// 📁 Curriculum
// -----------------------------
export const getCurriculumsByStudy = (studyId, page = 0, size = 10) =>
    axios.get(`${GROUP_BASE}/curriculums/study/${studyId}`, {
        params: { page, size },
    });

// -----------------------------
// 📁 StudyMember
// -----------------------------
export const applyToStudy = (studyId, userId) =>
    axios.post(`${GROUP_BASE}/study-members`, null, {
        params: { studyId, userId },
    });

export const getStudyMembersByStudy = (studyId, page = 0, size = 10) =>
    axios.get(`${GROUP_BASE}/study-members/by-study`, {
        params: { studyId, page, size },
    });

export const updateStudyMemberStatus = (id, status) =>
    axios.put(`${GROUP_BASE}/study-members/${id}`, { status });

export const kickMember = (memberId, requesterId) =>
    axios.delete(`${GROUP_BASE}/study-members/${memberId}/kick`, {
        params: { requesterId },
    });

export const acceptMember = (id, requesterEmail) =>
    axios.put(`${GROUP_BASE}/study-members/${id}/accept`, null, {
        params: { requesterEmail },
    });

export const rejectMember = (id, requesterId) =>
    axios.put(`${GROUP_BASE}/study-members/${id}/reject`, null, {
        params: { requesterId },
    });

export const leaveStudyGroup = (memberId, userId) =>
    axios.delete(`${GROUP_BASE}/study-members/${memberId}/leave`, {
        params: { userId },
    });

export const getApplicantsByStudy = (studyId, page = 0, size = 10) =>
    axios.get(`${GROUP_BASE}/study-members/${studyId}/applicants`, {
        params: { page, size },
    });

// -----------------------------
// 📁 Todo
// -----------------------------
export const getAllTodos = () =>
    axios.get(`${GROUP_BASE}/todos`);

export const createTodo = (todoDto) =>
    axios.post(`${GROUP_BASE}/todos`, todoDto);

export const updateTodo = (id, todoDto) =>
    axios.put(`${GROUP_BASE}/todos/${id}`, todoDto);

export const deleteTodo = (id) =>
    axios.delete(`${GROUP_BASE}/todos/${id}`);

// -----------------------------
// 📁 Admin - StudyGroup
// -----------------------------
export const adminDeleteStudyGroup = (id) =>
    axios.delete(`${GROUP_BASE}/admin/study-groups/${id}`);