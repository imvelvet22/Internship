<template>
    <div class="project-form-page">
      <a-page-header 
        title="Add New Project" 
        class="page-header"
        @back="() => navigateTo('/projects')"
      />
      
      <a-card class="project-form-card">
        <a-form 
          layout="vertical" 
          @finish="createProject"
          :model="newProject"
          :rules="formRules"
          ref="projectForm"
        >
          <a-form-item label="Project Name" name="projectName">
            <a-input v-model:value="newProject.projectName" placeholder="Enter project name" />
          </a-form-item>
          
          <a-form-item label="Client" name="client">
            <a-input v-model:value="newProject.client" placeholder="Enter client name" />
          </a-form-item>
          
          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item label="Start Date" name="startDate">
                <a-date-picker 
                  v-model:value="newProject.startDate" 
                  style="width: 100%" 
                  format="YYYY-MM-DD"
                  placeholder="Select start date"
                />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="End Date" name="endDate">
                <a-date-picker 
                  v-model:value="newProject.endDate" 
                  style="width: 100%" 
                  format="YYYY-MM-DD"
                  placeholder="Select end date"
                />
              </a-form-item>
            </a-col>
          </a-row>
          
          <a-form-item>
            <a-space>
              <a-button type="primary" html-type="submit" :loading="loading">
                Submit
              </a-button>
              <a-button @click="navigateTo('/projects')">
                Cancel
              </a-button>
            </a-space>
          </a-form-item>
        </a-form>
      </a-card>
    </div>
  </template>
  
  <script setup>
  import { ref, reactive } from 'vue';
  import { message } from 'ant-design-vue';
  import dayjs from 'dayjs';
  
  const loading = ref(false);
  const projectForm = ref();
  
  const newProject = reactive({
    projectName: '',
    client: '',
    startDate: null,
    endDate: null,
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
      { 
        validator: (rule, value) => {
          if (!value) {
            return Promise.reject('Please select end date');
          }
          if (newProject.startDate && value.isBefore(newProject.startDate)) {
            return Promise.reject('End date must be after start date');
          }
          return Promise.resolve();
        }, 
        trigger: 'change' 
      }
    ]
  });
  
  // Create a new project
  const createProject = async () => {
    try {
      await projectForm.value.validate();
      loading.value = true;
      
      await $fetch('http://localhost:5000/api/projects', {
        method: 'POST',
        body: {
          ...newProject,
          startDate: newProject.startDate?.format('YYYY-MM-DD'),
          endDate: newProject.endDate?.format('YYYY-MM-DD'),
        },
      });
      
      message.success('Project created successfully');
      navigateTo('/projects');
    } catch (error) {
      console.error('Error creating project:', error);
      if (error.response && error.response._data) {
        message.error(error.response._data.message || 'Failed to create project');
      } else {
        message.error('Failed to create project');
      }
    } finally {
      loading.value = false;
    }
  };
  </script>
  
  <style scoped>
  .project-form-page {
    max-width: 800px;
    margin: 0 auto;
    padding: 24px;
  }
  
  .page-header {
    padding-left: 0;
    padding-right: 0;
    margin-bottom: 24px;
  }
  
  .project-form-card {
    padding: 24px;
  }
  </style>