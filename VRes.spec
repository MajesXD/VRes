# -*- mode: python ; coding: utf-8 -*-

import os
from PyInstaller.utils.hooks import collect_submodules

block_cipher = None

a = Analysis(
    ['launch.py'],
    pathex=['.'],
    binaries=[],
    datas=[
        ('vres/*.py', 'vres'),
        ('rezerwacje/*.py', 'rezerwacje'),
        ('static/**/*', 'static'),
        ('templates/**/*', 'templates'),
        ('db.sqlite3', '.'),
    ],
    hiddenimports=collect_submodules('django'),
    hookspath=[],
    runtime_hooks=[],
    excludes=[],
    win_no_prefer_redirects=False,
    win_private_assemblies=False,
    cipher=block_cipher,
)

pyz = PYZ(a.pure, a.zipped_data, cipher=block_cipher)

exe = EXE(
    pyz,
    a.scripts,
    [],
    exclude_binaries=True,
    name='VRes',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    console=True,
)

coll = COLLECT(
    exe,
    a.binaries,
    a.zipfiles,
    a.datas,
    strip=False,
    upx=True,
    name='VRes'
)