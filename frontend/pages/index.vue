<template>
  <div class="home-container">
    <a-card class="home-card" :bordered="false">
      <div class="home-content">
        <a-avatar :size="80" class="logo" style="background-color: #1890ff">
          <template #icon><ProjectOutlined /></template>
        </a-avatar>
        
        <a-typography-title :level="2" class="title">
          Welcome to Project Management
        </a-typography-title>
        
        <a-typography-paragraph class="description">
          Streamline your projects with our powerful tools.
        </a-typography-paragraph>
        
        <nuxt-link to="/projects">
          <a-button type="primary" size="large" class="action-button">
            <template #icon><RocketOutlined /></template>
            Get Started
          </a-button>
        </nuxt-link>
      </div>
    </a-card>
  </div>
</template>

<script setup>
import { ProjectOutlined, RocketOutlined } from '@ant-design/icons-vue';
</script>

<style scoped>
.home-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(to right, #f5f7fa, #e4e8ed);
  padding: 20px;
}

.home-card {
  width: 100%;
  max-width: 600px;
  text-align: center;
  background: transparent;
  box-shadow: none;
}

.home-content {
  padding: 40px 20px;
}

.logo {
  margin-bottom: 24px;
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.3);
}

.title {
  color: #1d1d1d;
  margin-bottom: 16px !important;
}

.description {
  color: #595959;
  font-size: 1.1em;
  max-width: 80%;
  margin: 0 auto 32px !important;
}

.action-button {
  height: 48px;
  padding: 0 40px;
  font-size: 16px;
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.3);
  transition: all 0.3s ease;
}

.action-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(24, 144, 255, 0.4);
}

@media (max-width: 768px) {
  .home-content {
    padding: 20px;
  }
  
  .description {
    max-width: 100%;
  }
}
</style>