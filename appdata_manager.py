"""
AppData Manager for AutoPilot IDE
Manages application data storage in AppData folder with dedicated subdirectories
"""
import os
import json
import shutil
from pathlib import Path
from datetime import datetime
import logging

logger = logging.getLogger(__name__)


class AppDataManager:
    """Manages application data storage in AppData directory"""
    
    def __init__(self, app_name="AutoPilot-IDE"):
        """Initialize AppData manager with application name"""
        self.app_name = app_name
        self.base_dir = self._get_appdata_path()
        self._ensure_directories()
        logger.info(f"AppData directory initialized at: {self.base_dir}")
    
    def _get_appdata_path(self):
        """Get the appropriate AppData path for the current OS"""
        if os.name == 'nt':  # Windows
            appdata = os.environ.get('APPDATA')
            if not appdata:
                appdata = os.path.expanduser('~\\AppData\\Roaming')
        elif os.name == 'posix':  # Linux/Mac
            if os.uname().sysname == 'Darwin':  # macOS
                appdata = os.path.expanduser('~/Library/Application Support')
            else:  # Linux
                appdata = os.path.expanduser('~/.config')
        else:
            appdata = os.path.expanduser('~')
        
        return Path(appdata) / self.app_name
    
    def _ensure_directories(self):
        """Create all necessary subdirectories"""
        directories = [
            'projects',
            'themes',
            'extensions',
            'layouts',
            'settings',
            'logs',
            'cache'
        ]
        
        for directory in directories:
            dir_path = self.base_dir / directory
            dir_path.mkdir(parents=True, exist_ok=True)
            logger.debug(f"Ensured directory exists: {dir_path}")
    
    # Projects Management
    def get_projects_dir(self):
        """Get the projects directory path"""
        return self.base_dir / 'projects'
    
    def list_projects(self):
        """List all projects"""
        projects_dir = self.get_projects_dir()
        projects = []
        
        for project_file in projects_dir.glob('*.json'):
            try:
                with open(project_file, 'r', encoding='utf-8') as f:
                    project_data = json.load(f)
                    projects.append(project_data)
            except Exception as e:
                logger.error(f"Error loading project {project_file}: {e}")
        
        return sorted(projects, key=lambda x: x.get('lastOpened', ''), reverse=True)
    
    def save_project(self, project_data):
        """Save project data"""
        project_id = project_data.get('id')
        if not project_id:
            raise ValueError("Project must have an 'id' field")
        
        project_file = self.get_projects_dir() / f"{project_id}.json"
        
        with open(project_file, 'w', encoding='utf-8') as f:
            json.dump(project_data, f, indent=2)
        
        logger.info(f"Saved project: {project_data.get('name', project_id)}")
        return project_file
    
    def load_project(self, project_id):
        """Load project data by ID"""
        project_file = self.get_projects_dir() / f"{project_id}.json"
        
        if not project_file.exists():
            raise FileNotFoundError(f"Project not found: {project_id}")
        
        with open(project_file, 'r', encoding='utf-8') as f:
            return json.load(f)
    
    def delete_project(self, project_id):
        """Delete a project"""
        project_file = self.get_projects_dir() / f"{project_id}.json"
        
        if project_file.exists():
            project_file.unlink()
            logger.info(f"Deleted project: {project_id}")
            return True
        return False
    
    # Themes Management
    def get_themes_dir(self):
        """Get the themes directory path"""
        return self.base_dir / 'themes'
    
    def list_themes(self):
        """List all available themes"""
        themes_dir = self.get_themes_dir()
        themes = []
        
        for theme_file in themes_dir.glob('*.json'):
            try:
                with open(theme_file, 'r', encoding='utf-8') as f:
                    theme_data = json.load(f)
                    themes.append(theme_data)
            except Exception as e:
                logger.error(f"Error loading theme {theme_file}: {e}")
        
        return themes
    
    def save_theme(self, theme_data):
        """Save theme data"""
        theme_id = theme_data.get('id')
        if not theme_id:
            raise ValueError("Theme must have an 'id' field")
        
        theme_file = self.get_themes_dir() / f"{theme_id}.json"
        
        with open(theme_file, 'w', encoding='utf-8') as f:
            json.dump(theme_data, f, indent=2)
        
        logger.info(f"Saved theme: {theme_data.get('name', theme_id)}")
        return theme_file
    
    def load_theme(self, theme_id):
        """Load theme data by ID"""
        theme_file = self.get_themes_dir() / f"{theme_id}.json"
        
        if not theme_file.exists():
            raise FileNotFoundError(f"Theme not found: {theme_id}")
        
        with open(theme_file, 'r', encoding='utf-8') as f:
            return json.load(f)
    
    # Extensions Management
    def get_extensions_dir(self):
        """Get the extensions directory path"""
        return self.base_dir / 'extensions'
    
    def list_extensions(self):
        """List all installed extensions"""
        extensions_dir = self.get_extensions_dir()
        extensions = []
        
        for ext_file in extensions_dir.glob('*.json'):
            try:
                with open(ext_file, 'r', encoding='utf-8') as f:
                    ext_data = json.load(f)
                    extensions.append(ext_data)
            except Exception as e:
                logger.error(f"Error loading extension {ext_file}: {e}")
        
        return extensions
    
    def save_extension(self, extension_data):
        """Save extension data"""
        ext_id = extension_data.get('id')
        if not ext_id:
            raise ValueError("Extension must have an 'id' field")
        
        ext_file = self.get_extensions_dir() / f"{ext_id}.json"
        
        with open(ext_file, 'w', encoding='utf-8') as f:
            json.dump(extension_data, f, indent=2)
        
        logger.info(f"Saved extension: {extension_data.get('name', ext_id)}")
        return ext_file
    
    def load_extension(self, ext_id):
        """Load extension data by ID"""
        ext_file = self.get_extensions_dir() / f"{ext_id}.json"
        
        if not ext_file.exists():
            raise FileNotFoundError(f"Extension not found: {ext_id}")
        
        with open(ext_file, 'r', encoding='utf-8') as f:
            return json.load(f)
    
    # Layouts Management
    def get_layouts_dir(self):
        """Get the layouts directory path"""
        return self.base_dir / 'layouts'
    
    def list_layouts(self):
        """List all saved layouts"""
        layouts_dir = self.get_layouts_dir()
        layouts = []
        
        for layout_file in layouts_dir.glob('*.json'):
            try:
                with open(layout_file, 'r', encoding='utf-8') as f:
                    layout_data = json.load(f)
                    layouts.append(layout_data)
            except Exception as e:
                logger.error(f"Error loading layout {layout_file}: {e}")
        
        return sorted(layouts, key=lambda x: x.get('savedAt', ''), reverse=True)
    
    def save_layout(self, layout_data):
        """Save window layout"""
        layout_id = layout_data.get('id')
        if not layout_id:
            raise ValueError("Layout must have an 'id' field")
        
        # Add timestamp
        layout_data['savedAt'] = datetime.now().isoformat()
        
        layout_file = self.get_layouts_dir() / f"{layout_id}.json"
        
        with open(layout_file, 'w', encoding='utf-8') as f:
            json.dump(layout_data, f, indent=2)
        
        logger.info(f"Saved layout: {layout_data.get('name', layout_id)}")
        return layout_file
    
    def load_layout(self, layout_id):
        """Load layout data by ID"""
        layout_file = self.get_layouts_dir() / f"{layout_id}.json"
        
        if not layout_file.exists():
            raise FileNotFoundError(f"Layout not found: {layout_id}")
        
        with open(layout_file, 'r', encoding='utf-8') as f:
            return json.load(f)
    
    def delete_layout(self, layout_id):
        """Delete a layout"""
        layout_file = self.get_layouts_dir() / f"{layout_id}.json"
        
        if layout_file.exists():
            layout_file.unlink()
            logger.info(f"Deleted layout: {layout_id}")
            return True
        return False
    
    # Settings Management
    def get_settings_file(self):
        """Get the main settings file path"""
        return self.base_dir / 'settings' / 'settings.json'
    
    def load_settings(self):
        """Load application settings"""
        settings_file = self.get_settings_file()
        
        if not settings_file.exists():
            return self._get_default_settings()
        
        try:
            with open(settings_file, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception as e:
            logger.error(f"Error loading settings: {e}")
            return self._get_default_settings()
    
    def save_settings(self, settings_data):
        """Save application settings"""
        settings_file = self.get_settings_file()
        
        with open(settings_file, 'w', encoding='utf-8') as f:
            json.dump(settings_data, f, indent=2)
        
        logger.info("Saved application settings")
        return settings_file
    
    def _get_default_settings(self):
        """Get default application settings"""
        return {
            "theme": "dark",
            "fontSize": 14,
            "autoSave": True,
            "autoSaveInterval": 30,
            "currentLayout": "default",
            "lastProject": None,
            "recentProjects": [],
            "windowState": {
                "maximized": False,
                "width": 1200,
                "height": 800
            }
        }
    
    # Utility Methods
    def get_logs_dir(self):
        """Get the logs directory path"""
        return self.base_dir / 'logs'
    
    def get_cache_dir(self):
        """Get the cache directory path"""
        return self.base_dir / 'cache'
    
    def clear_cache(self):
        """Clear the cache directory"""
        cache_dir = self.get_cache_dir()
        
        if cache_dir.exists():
            shutil.rmtree(cache_dir)
            cache_dir.mkdir(parents=True, exist_ok=True)
            logger.info("Cache cleared")
            return True
        return False
    
    def get_storage_info(self):
        """Get storage information"""
        def get_dir_size(path):
            total = 0
            try:
                for entry in os.scandir(path):
                    if entry.is_file():
                        total += entry.stat().st_size
                    elif entry.is_dir():
                        total += get_dir_size(entry.path)
            except Exception as e:
                logger.error(f"Error calculating size for {path}: {e}")
            return total
        
        return {
            "basePath": str(self.base_dir),
            "totalSize": get_dir_size(self.base_dir),
            "projects": len(self.list_projects()),
            "themes": len(self.list_themes()),
            "extensions": len(self.list_extensions()),
            "layouts": len(self.list_layouts())
        }


# Global instance
appdata_manager = AppDataManager()
