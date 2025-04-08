<template>
    <div class="project-management">
      <a-page-header title="Project Management" class="page-header">
        <template #extra>
          <a-button type="primary" @click="navigateToAddProject">
            <template #icon><PlusOutlined /></template>
            Add Project
          </a-button>
        </template>
      </a-page-header>
  
      <a-card title="Project List" class="project-list">
        <a-empty v-if="projects.length === 0" description="No projects found" />
        
        <a-table 
          v-else
          :columns="columns" 
          :data-source="projects" 
          :row-key="record => record.id"
          bordered
          :loading="loading"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'dates'">
              {{ formatDate(record.startDate) }} - {{ formatDate(record.endDate) }}
            </template>
            <template v-else-if="column.key === 'status'">
              <a-tag :color="getStatusColor(record.status)">
                {{ record.status || 'Not Started' }}
              </a-tag>
            </template>
            <template v-else-if="column.key === 'actions'">
              <a-space>
                <a-tooltip title="Edit">
                  <a-button type="link" @click="showEditModal(record)">
                    <template #icon><EditOutlined /></template>
                  </a-button>
                </a-tooltip>
                <a-tooltip title="Delete">
                  <a-popconfirm
                    title="Are you sure to delete this project?"
                    ok-text="Yes"
                    cancel-text="No"
                    @confirm="deleteProject(record)"
                  >
                    <a-button type="link" danger>
                      <template #icon><DeleteOutlined /></template>
                    </a-button>
                  </a-popconfirm>
                </a-tooltip>
              </a-space>
            </template>
          </template>
        </a-table>
      </a-card>
  
      <!-- Edit Project  -->
      <a-modal
        v-model:visible="editModalVisible"
        title="Edit Project"
        ok-text="Save"
        cancel-text="Cancel"
        @ok="handleEditSubmit"
        @cancel="editModalVisible = false"
        :confirm-loading="loading"
      >
        <a-form 
          layout="vertical" 
          :model="editingProject"
          :rules="formRules"
          ref="editForm"
        >
          <a-form-item label="Project Name" name="projectName">
            <a-input v-model:value="editingProject.projectName" />
          </a-form-item>
          
          <a-form-item label="Client" name="client">
            <a-input v-model:value="editingProject.client" />
          </a-form-item>
          
          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item label="Start Date" name="startDate">
                <a-date-picker 
                  v-model:value="editingProject.startDate" 
                  style="width: 100%" 
                  format="YYYY-MM-DD"
                />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="End Date" name="endDate">
                <a-date-picker 
                  v-model:value="editingProject.endDate" 
                  style="width: 100%" 
                  format="YYYY-MM-DD"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-form-item label="Status" name="status">
            <a-select v-model:value="editingProject.status">
              <a-select-option value="Not Started">Not Started</a-select-option>
              <a-select-option value="In Progress">In Progress</a-select-option>
              <a-select-option value="Completed">Completed</a-select-option>
            </a-select>
          </a-form-item>
        </a-form>
      </a-modal>
    </div>
  </template>
  
  <script setup>
  import { ref, reactive, onMounted } from 'vue';
  import { 
    EditOutlined, 
    DeleteOutlined, 
    PlusOutlined 
  } from '@ant-design/icons-vue';
  import dayjs from 'dayjs';
  import { message } from 'ant-design-vue';
  import { useRouter } from 'vue-router';
  
  const router = useRouter();
  const loading = ref(false);
  const editModalVisible = ref(false);
  const projects = ref([]);
  const editForm = ref();
  
  const editingProject = reactive({
    id: null,
    projectName: '',
    client: '',
    startDate: null,
    endDate: null,
    status: 'Not Started'
  });
  
  const formRules = reactive({
    projectName: [
      { required: true, message: 'Please input project name', trigger: 'blur' },
      { min: 3, message: 'Project name must be at least 3 characters', trigger: 'blur' }
    ],
    client: [
      { required: true, message: 'Please input client name', trigger: 'blur' },
      { min: 2, message: 'Client name must be at least 2 characters', trigger: 'blur' }
    ],
    startDate: [
      { required: true, message: 'Please select start date', trigger: 'change' }
    ],
    endDate: [
      { required: true, message: 'Please select end date', trigger: 'change' },
      { validator: validateEndDate, trigger: 'change' }
    ]
  });
  
  function validateEndDate(rule, value) {
    if (!value) {
      return Promise.reject('Please select end date');
    }
    if (editingProject.startDate && value.isBefore(editingProject.startDate)) {
      return Promise.reject('End date must be after start date');
    }
    return Promise.resolve();
  }
  
  const columns = [
    {
      title: 'Project Name',
      dataIndex: 'projectName',
      key: 'projectName',
      sorter: (a, b) => a.projectName.localeCompare(b.projectName)
    },
    {
      title: 'Client',
      dataIndex: 'client',
      key: 'client',
      sorter: (a, b) => a.client.localeCompare(b.client)
    },
    {
      title: 'Planned Duration',
      key: 'dates',
    },
    {
      title: 'Status',
      key: 'status',
    },
    {
      title: 'Actions',
      key: 'actions',
      width: '150px',
    },
  ];
  
 
  const navigateToAddProject = () => {
    router.push('/projects/new');
  };

  const fetchProjects = async () => {
    try {
      loading.value = true;
      const data = await $fetch('http://localhost:5000/api/projects');
      projects.value = data;
    } catch (error) {
      console.error('Error fetching projects:', error);
      message.error('Failed to fetch projects');
    } finally {
      loading.value = false;
    }
  };
  
  // Status color mapping
  const getStatusColor = (status) => {
    switch (status) {
      case 'In Progress': return 'blue';
      case 'Completed': return 'green';
      default: return 'gray';
    }
  };
  
  // Show edit modal
  const showEditModal = (project) => {
    Object.assign(editingProject, {
      id: project.id,
      projectName: project.projectName,
      client: project.client,
      startDate: project.startDate ? dayjs(project.startDate) : null,
      endDate: project.endDate ? dayjs(project.endDate) : null,
      status: project.status || 'Not Started'
    });
    editModalVisible.value = true;
  };
  
 
  const handleEditSubmit = async () => {
    try {
      await editForm.value.validate();
      loading.value = true;
      
      await $fetch(`http://localhost:5000/api/projects/${editingProject.id}`, {
        method: 'PUT',
        body: {
          projectName: editingProject.projectName,
          client: editingProject.client,
          startDate: editingProject.startDate?.format('YYYY-MM-DD'),
          endDate: editingProject.endDate?.format('YYYY-MM-DD'),
          status: editingProject.status
        },
      });
      
      message.success('Project updated successfully');
      editModalVisible.value = false;
      await fetchProjects();
    } catch (error) {
      console.error('Error updating project:', error);
      if (error.response && error.response._data) {
        message.error(error.response._data.message || 'Failed to update project');
      } else {
        message.error('Failed to update project');
      }
    } finally {
      loading.value = false;
    }
  };
  
 
  const deleteProject = async (project) => {
    try {
      loading.value = true;
      await $fetch(`http://localhost:5000/api/projects/${project.id}`, {
        method: 'DELETE',
      });
      message.success('Project deleted successfully');
      await fetchProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
      if (error.response && error.response._data) {
        message.error(error.response._data.message || 'Failed to delete project');
      } else {
        message.error('Failed to delete project');
      }
    } finally {
      loading.value = false;
    }
  };
  
  
  const formatDate = (dateString) => {
    return dateString ? dayjs(dateString).format('MMM D, YYYY') : 'N/A';
  };
  
  
  onMounted(() => {
    fetchProjects();
  });
  </script>
  
  <style scoped>
  .project-management {
    max-width: 1200px;
    margin: 0 auto;
    padding: 24px;
  }
  
  .page-header {
    padding-left: 0;
    padding-right: 0;
    border: none;
  }
  
  .project-list {
    margin-top: 24px;
    border: none;
  }
  
  .ant-table {
    border-radius: 8px;
    overflow: hidden;
  }
  
  .ant-tag {
    margin-right: 0;
  }
  </style>